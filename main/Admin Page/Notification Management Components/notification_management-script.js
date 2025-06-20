

import { supabase } from "../../main.js";

let appointmentData = []; 

async function fetchAppointments() {
    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            appointment_id,
            customer_id,
            barber_id,
            service_id,
            branch_id,
            date,
            time,
            appointment_type,
            status,
            Customers(Users(name, email)),
            Barbers(Staff(Users(name, email))),
            Services(name),
            Branches(name)
        `);

    if (error) {
        console.error("Error fetching appointments:", error);
        return;
    }

    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    appointmentData = sortedData; 
    displayAppointments(sortedData);
    
}
async function displayAppointments(data) {
    const appointmentDropdown = document.getElementById('appointmentSelect');
    const searchInput = document.getElementById('searchInput');
    const emailField = document.getElementById('user_email');
    const recipientType = document.getElementById("recipientType");

    if (!appointmentDropdown || !searchInput || !emailField || !recipientType) {
        console.error("Dropdown, search input, or email field not found!");
        return;
    }

    // Load dropdown
    function populateDropdown(filteredData) {
        appointmentDropdown.innerHTML = '<option value="">Select Appointment</option>';

        filteredData.forEach(appointment => {
            const customerName = appointment.Customers?.Users?.name || "Unknown Client";
            const option = document.createElement('option');
            option.value = appointment.appointment_id;
            option.textContent = `${customerName} - ${appointment.date} - ${appointment.time}`;
            appointmentDropdown.appendChild(option);
        });
    }

    populateDropdown(data);

    // Filter dropdown based on search input
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();

        const filteredAppointments = data.filter(appointment => {
            const customerName = appointment.Customers?.Users?.name.toLowerCase() || "";
            return customerName.includes(searchValue);
        });

        populateDropdown(filteredAppointments);
    });

    appointmentDropdown.addEventListener("change", function () {
        const selectedAppointmentId = this.value;
        const selectedAppointment = appointmentData.find(app => app.appointment_id == selectedAppointmentId);

        if (selectedAppointment) {
            if (recipientType.value === "client") {
                emailField.value = selectedAppointment.Customers?.Users?.email || "";
            } else if (recipientType.value === "barber") {
                emailField.value = selectedAppointment.Barbers?.Staff?.Users?.email || "";
            } else {
                emailField.value = "";
            }
        } else {
            emailField.value = "";
        }
    });

    recipientType.addEventListener("change", function () {
        appointmentDropdown.dispatchEvent(new Event("change")); 
    });
}



document.addEventListener('DOMContentLoaded', fetchAppointments);

async function insertNotification(user_id, message, type, status) {
    const { data, error } = await supabase
        .from("Notifications") 
        .insert([
            {
                user_id: user_id,
                message: message,
                type: type,
                status: status
            }
        ]);

    if (error) {
        console.error("Error inserting notification:", error);
        alert("Failed to save notification!");
        return;
    }

    console.log("Notification inserted successfully:", data);
    alert("Notification saved successfully!");
}

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("5ubOvuijaJO2rgh0M"); 

    document.getElementById("notification-form").addEventListener("submit", function (event) {
        event.preventDefault(); 

        const recipient_type = document.getElementById("recipientType").value;
        const user_email = document.getElementById("user_email").value;
        const statusType = document.getElementById("statusType").value;
        const notificationMessage = document.getElementById("notificationMessage").value;
        const selectedAppointmentId = document.getElementById("appointmentSelect").value;

        const selectedAppointment = appointmentData.find(app => app.appointment_id == selectedAppointmentId);

        if (!selectedAppointment) {
            alert("Please select a valid appointment.");
            return;
        }

        const user_id = selectedAppointment.customer_id;
        const customerName = selectedAppointment.Customers?.Users?.name || "Guest";
        const appointmentDate = selectedAppointment.date;
        const appointmentTime = selectedAppointment.time;
        const appointmentLocation = selectedAppointment.Branches?.name || "Unknown Location";
        const serviceName = selectedAppointment.Services?.name || "Unknown Service";
        
        // Send email using EmailJS
        emailjs.send("service_u87lcgg", "template_fgh2lr3", {
            recipient_type: recipient_type,
            user_email: user_email,
            customer_name: customerName,
            statusType: statusType,
            notificationMessage: notificationMessage,
            appointment_date: appointmentDate,  
            appointment_time: appointmentTime, 
            appointment_location: appointmentLocation, 
            service_name: serviceName 
        }).then(
            async function (response) {
                console.log("Message sent successfully:", response);
    
                // Insert Notification into Supabase
                await insertNotification(user_id, notificationMessage, recipient_type, statusType);
    
                document.getElementById("notification-form").reset();
            },
            function (error) {
                alert("Failed to send message. Please try again.");
                console.error("EmailJS Error:", error);
            }
        );
    });
});

async function fetchNotifications(){
    const{ data, error} = await supabase
        .from('Notifications')
        .select('*');
    if(error){
        console.error("Error fetching services:", error);
        return;
    }

    const tableBody = document.getElementById('notificationTableBody');

    if (!tableBody){
        console.error("table body not found");
        return;
    }

    tableBody.innerHTML = " "; //clear

    data.forEach(notifs => {
        let row = `
            <tr>
                <td>${notifs.type}</td>
                <td>${notifs.status}</td>
                <td>${notifs.message}</td>
                <td><button class="btn-delete" onclick="deleteNotification('${notifs.notification_id}')">Delete</button></td> 
            </tr>
            `;
        tableBody.innerHTML += row;

    })
}
window.deleteNotification = async function(notification_Id) {
    try {
        const { error } = await supabase
            .from('Notifications')
            .delete()
            .eq('notification_id', notification_Id);

        if (error) throw error;

        console.log("Notification record deleted successfully!"); 
        fetchNotifications(); 

    } catch (err) {
        console.error("Error deleting notification record:", err);
    }
};

document.addEventListener('DOMContentLoaded', fetchNotifications);
