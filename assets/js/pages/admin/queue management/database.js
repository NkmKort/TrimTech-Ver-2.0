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

// Fetch Queues
async function fetchQueues() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            appointment_id,
            customer_id,
            barber_id,
            service_id,
            cost,
            branch_id,
            time,
            status,
            Customers(Users(name)),
            Barbers(Staff(Users(name))),
            Services(name),
            Branches(name)
        `)
        .eq('date', today);

    if (error) {
        console.error("Error fetching queues:", error);
        return;
    }

    const tableBody = document.getElementById("queueTableBody");
    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing content

    displayQueues(data);
    filterQueues();
}

// Display Queues
async function displayQueues(data) {
    const tableBody = document.getElementById("queueTableBody");

    data.forEach(queue => {
        let formattedTime = queue.time ? queue.time.split('.')[0] : "Deleted";
        let row = `
            <tr>
                <td>${queue.Customers?.Users?.name || "Deleted"}</td>
                <td>${queue.Barbers?.Staff?.Users?.name || "Deleted"}</td>
                <td>${queue.Services?.name || "Deleted"}</td>
                <td>${queue.cost || "Deleted"}</td>
                <td>${queue.Branches?.name || "Deleted"}</td>
                <td>${formattedTime}</td>
                <td>${queue.status || "Deleted"}</td>
                <td>
                    <button class="btn btn-edit btn-green" onclick="editQueue('${queue.appointment_id}')">Edit</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Fetch and display Barbers, Services, and Branches as options in adding queues
async function fetchAndDisplayOptions() {
    try {
        // Fetch Barbers
        const { data: barbers, error: barbersError } = await supabase
            .from('Barbers')
            .select('barber_id, Staff(Users(name))');
        if (barbersError) throw barbersError;

        const barberSelect = document.getElementById('queueBarber');
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

        const serviceSelect = document.getElementById('queueService');
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

        const branchSelect = document.getElementById('queuebranch');
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

// Fetch Branches as options for queue search
async function fetchAndDisplayBranchesForSearch() {
    try {
        // Fetch Branches
        const { data: branches, error: branchesError } = await supabase
            .from('Branches')
            .select('branch_id, name');
        if (branchesError) throw branchesError;

        const branchFilter = document.getElementById('queueFilterBranch');
        branchFilter.innerHTML = '<option value="">All Branches</option>';
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

// Fetch Queues on div load
document.addEventListener('DOMContentLoaded', () => {
    const queueManagementSection = document.querySelector('.main-queue_management');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = queueManagementSection.classList.contains('active');
                if (isActive) {
                    fetchQueues();
                    fetchAndDisplayOptions();
                    fetchAndDisplayBranchesForSearch();
                }
            }
        });
    });

    observer.observe(queueManagementSection, { attributes: true });
});

// Add Queues
document.getElementById('submitAddQueue').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("Add to Queue clicked");

    const email = document.getElementById('queueEmail').value;
    const barber_id = document.getElementById('queueBarber').value;
    const service_id = document.getElementById('queueService').value;
    const branch_id = document.getElementById('queuebranch').value;

    try {
        // Fetch customer_id based on email
        const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('user_id')
            .eq('email', email)
            .single();

        if (userError) {
            console.error("Error fetching customer ID:", userError);
            showMessage("Error fetching customer ID", "addQueueMessage");
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
                    date: new Date().toISOString().split('T')[0],
                    appointment_type: 'Walk-in',
                    status: 'Confirmed'
                }
            ]);

        if (error) {
            console.error("Error adding to queue:", error);
            showMessage("Error adding to queue", "addQueueMessage");
            return;
        }

        showMessage("Added to queue successfully", "addQueueMessage");
        fetchQueues();
        closeAddQueueModal();
    } catch (error) {
        console.error("Error adding to queue:", error.message);
        showMessage("Error adding to queue", "addQueueMessage");
    }
});

// Edit Queues
window.editQueue = async function(appointment_id) {
    console.log("Edit Queue clicked");

    const { data, error } = await supabase
        .from('Appointments')
        .select('status')
        .eq('appointment_id', appointment_id)
        .single();
    
    if (error) {
        console.error("Error fetching queue:", error);
        return;
    }

    if (!data) {
        console.error("Queue not found!");
        return;
    }

    console.log("Queue data:", data);

    document.getElementById('queueStatus').value = data.status;

    openEditQueueModal();

    document.getElementById('submitEditQueue').onclick = async function(event) {
        event.preventDefault();
        console.log("Update Queue clicked");

        const status = document.getElementById('queueStatus').value;

        try {
            const { data, error } = await supabase
                .from('Appointments')
                .update({ status })
                .eq('appointment_id', appointment_id);

            if (error) {
                console.error("Error updating queue:", error);
                showMessage("Error updating queue", "editQueueMessage");
                return;
            }

            showMessage("Queue updated successfully", "editQueueMessage");
            fetchQueues();
            closeEditQueueModal();
        } catch (error) {
            console.error("Error updating queue:", error.message);
            showMessage("Error updating queue", "editQueueMessage");
        }
    }
}

fetchQueues();
fetchAndDisplayOptions();
fetchAndDisplayBranchesForSearch();
