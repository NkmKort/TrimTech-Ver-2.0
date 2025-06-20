// Open Add Appointment Modal
function openAddAppointmentModal() {
    document.getElementById('addAppointmentModal').style.display = "block";
}

// Close Add Appointment Modal
function closeAddAppointmentModal() {
    document.getElementById('addAppointmentModal').style.display = "none";
}

// Open Edit Appointment Modal
function openEditAppointmentModal() {
    document.getElementById('editAppointmentModal').style.display = "block";
}

// Close Edit Appointment Modal
function closeEditAppointmentModal() {
    document.getElementById('editAppointmentModal').style.display = "none";
}

// Always Reset Add Appointment Form
document.addEventListener('DOMContentLoaded', function() {
    const addAppointmentForm = document.querySelector('.addAppointmentForm');
    const addAppointmentButton = document.getElementById('addAppointmentButton');

    addAppointmentButton.addEventListener('click', function(e) {
        e.preventDefault();
        addAppointmentForm.reset();
    });
});

// Filter Appointments
function filterAppointments() {
    const searchInput = document.getElementById('searchAppointment').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const appointmentTableBody = document.getElementById('appointmentTableBody');
    const rows = appointmentTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const customerNameCell = rows[i].getElementsByTagName('td')[0];
        const barberNameCell = rows[i].getElementsByTagName('td')[1];
        const serviceNameCell = rows[i].getElementsByTagName('td')[2];
        const branchNameCell = rows[i].getElementsByTagName('td')[3];
        const dateCell = rows[i].getElementsByTagName('td')[4];
        const timeCell = rows[i].getElementsByTagName('td')[5];
        const statusCell = rows[i].getElementsByTagName('td')[7];

        const customerName = customerNameCell.textContent.toLowerCase();
        const barberName = barberNameCell.textContent.toLowerCase();
        const serviceName = serviceNameCell.textContent.toLowerCase();
        const branchName = branchNameCell.textContent.toLowerCase();
        const date = dateCell.textContent.toLowerCase();
        const time = timeCell.textContent.toLowerCase();
        const status = statusCell.textContent.toLowerCase();

        const matchesSearch = 
            customerName.includes(searchInput) ||
            barberName.includes(searchInput) ||
            serviceName.includes(searchInput) ||
            branchName.includes(searchInput) ||
            date.includes(searchInput) ||
            time.includes(searchInput) ||
            status.includes(searchInput);
        const matchesStatus = filterStatus === '' || status.includes(filterStatus);

        if (matchesSearch && matchesStatus) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}