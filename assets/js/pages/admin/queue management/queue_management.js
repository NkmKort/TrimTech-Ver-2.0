// Filter Queues
function filterQueues() {
    const searchInput = document.getElementById('searchQueue').value.toLowerCase();
    const filterStatus = document.getElementById('queueFilterStatus').value.toLowerCase();
    const filterBranch = document.getElementById('queueFilterBranch').value.toLowerCase();
    const queueTableBody = document.getElementById('queueTableBody');
    const rows = queueTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const customerNameCell = rows[i].getElementsByTagName('td')[0];
        const barberNameCell = rows[i].getElementsByTagName('td')[1];
        const serviceNameCell = rows[i].getElementsByTagName('td')[2];
        const branchNameCell = rows[i].getElementsByTagName('td')[4];
        const timeCell = rows[i].getElementsByTagName('td')[5];
        const statusCell = rows[i].getElementsByTagName('td')[6];

        const customerName = customerNameCell.textContent.toLowerCase();
        const barberName = barberNameCell.textContent.toLowerCase();
        const serviceName = serviceNameCell.textContent.toLowerCase();
        const branchName = branchNameCell.textContent.toLowerCase();
        const time = timeCell.textContent.toLowerCase();
        const status = statusCell.textContent.toLowerCase();

        const matchesSearch = 
            customerName.includes(searchInput) ||
            barberName.includes(searchInput) ||
            serviceName.includes(searchInput) ||
            branchName.includes(searchInput) ||
            time.includes(searchInput) ||
            status.includes(searchInput);
        const matchesStatus = filterStatus === '' || status.includes(filterStatus);
        const matchesBranch = filterBranch === '' || branchName.includes(filterBranch);

        if (matchesSearch && matchesStatus && matchesBranch) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Open Add Queue Modal
function openAddQueueModal() {
    document.getElementById('addQueueModal').style.display = "block";
}

// Close Add Queue Modal
function closeAddQueueModal() {
    document.getElementById('addQueueModal').style.display = "none";
}

// Open Edit Queue Modal
function openEditQueueModal() {
    document.getElementById('editQueueModal').style.display = "block";
}

// Close Edit Queue Modal
function closeEditQueueModal() {
    document.getElementById('editQueueModal').style.display = "none";
}

// Always Reset Add Queue Form
document.addEventListener('DOMContentLoaded', function() {
    const addQueueForm = document.getElementById('addQueueForm');
    const showAddQueueModal = document.getElementById('showAddQueueModal');

    showAddQueueModal.addEventListener('click', function(e) {
        e.preventDefault();
        addQueueForm.reset();
    });
});
