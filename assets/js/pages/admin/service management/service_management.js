// Filter Services
function filterServices() {
    const searchInput = document.getElementById('searchService').value.toLowerCase();
    const serviceTableBody = document.getElementById('serviceTableBody');
    const rows = serviceTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[0];
        const descriptionCell = rows[i].getElementsByTagName('td')[1];
        const priceCell = rows[i].getElementsByTagName('td')[2];

        const name = nameCell.textContent.toLowerCase();
        const description = descriptionCell.textContent.toLowerCase();
        const price = priceCell.textContent.toLowerCase();

        const matchesSearch = name.includes(searchInput) || description.includes(searchInput) || price.includes(searchInput);

        if (matchesSearch) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Open & Close Modals
function openAddServiceModal() {
    document.getElementById("addServiceModal").style.display = "block";
}

function closeAddServiceModal() {
    document.getElementById("addServiceModal").style.display = "none";
}

function openEditServiceModal() {
    document.getElementById("editServiceModal").style.display = "block";
}

function closeEditServiceModal() {
    document.getElementById("editServiceModal").style.display = "none";
}

// Always Reset Add Service Form
document.addEventListener('DOMContentLoaded', function() {
    const addServiceForm = document.getElementById('addServiceForm');
    const showAddServiceModal = document.getElementById('showAddServiceModal');

    showAddServiceModal.addEventListener('click', function(e) {
        e.preventDefault();
        addServiceForm.reset();
    });
});
