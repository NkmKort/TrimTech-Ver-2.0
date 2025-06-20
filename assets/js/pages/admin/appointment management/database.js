import { supabase } from "../../../config/supabase.js";

// Show Message
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);

    if (!messageDiv) return console.error("Message div not found: " + divId);
        messageDiv.style.display = "block";

    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(() => {
          messageDiv.style.display = "none";
        }, 1000);
    }, 5000);
}

// Fetch Appointments
async function fetchAppointments() {
    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            appointment_id,
            customer_id,
            barber_id,
            service_id,
            cost,
            branch_id,
            date,
            time,
            appointment_type,
            status,
            Customers(Users(name)),
            Barbers(Staff(Users(name))),
            Services(name),
            Branches(name)
        `);

    if (error) {
        console.error("Error fetching appointments:", error);
        return;
    }

    const tableBody = document.getElementById("appointmentTableBody");
    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing content

    displayAppointments(data);
    filterAppointments();
}

// Display Appointments
async function displayAppointments(data) {
    const tableBody = document.getElementById("appointmentTableBody");

    data.forEach(appointment => {
        let row = `
            <tr>
                <td>${appointment.Customers?.Users?.name || "Deleted"}</td>
                <td>${appointment.Barbers?.Staff?.Users?.name || "Deleted"}</td>
                <td>${appointment.Services?.name || "Deleted"}</td>
                <td>${appointment.cost || "Deleted"}</td>
                <td>${appointment.Branches?.name || "Deleted"}</td>
                <td>${appointment.date || "Deleted"}</td>
                <td>${appointment.time || "Deleted"}</td>
                <td>${appointment.appointment_type || "Deleted"}</td>
                <td>${appointment.status || "Deleted"}</td>
                <td>
                    <button class="btn btn-edit btn-green" onclick="editAppointment('${appointment.appointment_id}')">Edit</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Fetch and display Barbers, Services, and Branches as options in adding appointments
async function fetchAndDisplayOptions() {
    try {
        // Fetch Barbers
        const { data: barbers, error: barbersError } = await supabase
            .from('Barbers')
            .select('barber_id, Staff(Users(name))');
        if (barbersError) throw barbersError;

        const barberSelect = document.getElementById('addAppointmentForm-barberName');
        barberSelect.innerHTML = '<option value="">Select Barber</option>';
        barbers.forEach(barber => {
            const option = document.createElement('option');
            option.value = barber.barber_id;
            option.textContent = barber.Staff.Users.name;
            barberSelect.appendChild(option);
        });

        // Fetch Services
        const { data: services, error: servicesError } = await supabase
            .from('Services')
            .select('service_id, name');
        if (servicesError) throw servicesError;

        const serviceSelect = document.getElementById('addAppointmentForm-serviceName');
        serviceSelect.innerHTML = '<option value="">Select Service</option>';
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.service_id;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });

        // Fetch Branches
        const { data: branches, error: branchesError } = await supabase
            .from('Branches')
            .select('branch_id, name');
        if (branchesError) throw branchesError;

        const branchSelect = document.getElementById('addAppointmentForm-branchName');
        branchSelect.innerHTML = '<option value="">Select Branch</option>';
        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.branch_id;
            option.textContent = branch.name;
            branchSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching options:', error);
    }
}

// Fetch Branches as options for appointment search
async function fetchAndDisplayBranchesForSearch() {
    try {
        // Fetch Branches
        const { data: branches, error: branchesError } = await supabase
            .from('Branches')
            .select('branch_id, name');
        if (branchesError) throw branchesError;

        const branchFilter = document.getElementById('filterBranch');
        branchFilter.innerHTML = '<option value="">Select Branch</option>';
        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.name;
            option.textContent = branch.name;
            branchFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching branches:', error);
    }
}

// Fetch Appointments on div load
document.addEventListener('DOMContentLoaded', () => {
    const appointmentManagementSection = document.querySelector('.main-appointment_management');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = appointmentManagementSection.classList.contains('active');
                if (isActive) {
                    fetchAppointments();
                    fetchAndDisplayOptions();
                }
            }
        });
    });

    observer.observe(appointmentManagementSection, { attributes: true });
});

// Add Appointments
document.getElementById('submitAddAppointment').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("Save Appointment clicked");

    const email = document.getElementById('addAppointmentForm-customerEmail').value;
    const barber_id = document.getElementById('addAppointmentForm-barberName').value;
    const service_id = document.getElementById('addAppointmentForm-serviceName').value;
    const branch_id = document.getElementById('addAppointmentForm-branchName').value;
    const date = document.getElementById('addAppointmentForm-date').value;
    const time = document.getElementById('addAppointmentForm-time').value;
    const appointment_type = document.getElementById('addAppointmentForm-type').value;

    try {
        // Fetch customer_id based on email
        const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('user_id')
            .eq('email', email)
            .single();

        if (userError) {
            console.error("Error fetching customer ID:", userError);
            showMessage("Error fetching customer ID", "addAppointmentMessage");
            return;
        }

        const customer_id = userData.user_id;
        console.log("Customer ID:", customer_id);

        const { data, error } = await supabase
            .from('Appointments')
            .insert([
                {
                    customer_id: customer_id,
                    barber_id: barber_id,
                    service_id: service_id,
                    branch_id: branch_id,
                    date: date,
                    time: time,
                    appointment_type: appointment_type
                }
            ]);

        if (error) {
            console.error("Error adding appointment:", error);
            showMessage("Error adding appointment", "addAppointmentMessage");
            return;
        }

        showMessage("Appointment added successfully", "addAppointmentMessage");
        fetchAppointments();
        closeAddAppointmentModal();
    } catch (error) {
        console.error("Error adding appointment:", error.message);
        showMessage("Error adding appointment", "addAppointmentMessage");
    }
});

// Edit Appointments
window.editAppointment = async function(appointment_id) {
    console.log("Edit Appointment clicked");

    const { data, error } = await supabase
        .from('Appointments')
        .select('status')
        .eq('appointment_id', appointment_id)
        .single();
    
    if (error) {
        console.error("Error fetching appointment:", error);
        return;
    }

    if (!data) {
        console.error("Appointment not found!");
        return;
    }

    console.log("Appointment data:", data);

    document.getElementById('editAppointmentForm-status').value = data.status;

    openEditAppointmentModal();

    document.getElementById('submitEditAppointment').onclick = async function(event) {
        event.preventDefault();
        console.log("Update Appointment clicked");

        const status = document.getElementById('editAppointmentForm-status').value;

        try {
            const { data, error } = await supabase
                .from('Appointments')
                .update({ status })
                .eq('appointment_id', appointment_id);

            if (error) {
                console.error("Error updating appointment:", error);
                showMessage("Error updating appointment", "editAppointmentMessage");
                return;
            }

            showMessage("Appointment updated successfully", "editAppointmentMessage");
            fetchAppointments();
            closeEditAppointmentModal();
        } catch (error) {
            console.error("Error updating appointment:", error.message);
            showMessage("Error updating appointment", "editAppointmentMessage");
        }
    }
}
    
document.addEventListener('DOMContentLoaded', fetchAppointments);
document.addEventListener('DOMContentLoaded', fetchAndDisplayOptions);
document.addEventListener('DOMContentLoaded', fetchAndDisplayBranchesForSearch);
