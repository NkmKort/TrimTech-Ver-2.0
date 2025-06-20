// Filter Users
function filterUsers() {
    const searchInput = document.getElementById('searchUser').value.toLowerCase();
    const filterRole = document.getElementById('filterRole').value;
    const userTableBody = document.getElementById('userTableBody');
    const rows = userTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[0];
        const emailCell = rows[i].getElementsByTagName('td')[1];
        const phoneCell = rows[i].getElementsByTagName('td')[2];
        const roleCell = rows[i].getElementsByTagName('td')[3];

        const name = nameCell.textContent.toLowerCase();
        const email = emailCell.textContent.toLowerCase();
        const phone = phoneCell.textContent.toLowerCase();
        const role = roleCell.textContent.toLowerCase();

        const matchesSearch = name.includes(searchInput) || email.includes(searchInput) || phone.includes(searchInput);
        const matchesRole = filterRole === '' || role.includes(filterRole);

        if (matchesSearch && matchesRole) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Open & Close Modals
function openAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

function openEditUserModal() {
    document.getElementById('editUserModal').style.display = 'block';
}

function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Reset form on modal open
document.addEventListener('DOMContentLoaded', function() {
    const addUserForm = document.getElementById('addUserForm');
    const showAddUserForm = document.getElementById('showAddUserModal');

    showAddUserForm.addEventListener('click', function(e) {
        e.preventDefault();
        addUserForm.reset();
    });
});

// Show & Hide Password
const showHidePassword = (formPassword, formEye) => {
    const passwordInput = document.getElementById(formPassword),
            eyeIcon = document.getElementById(formEye)

    eyeIcon.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.add('ri-eye-2-line');
            eyeIcon.classList.remove('ri-eye-close-line');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('ri-eye-2-line');
            eyeIcon.classList.add('ri-eye-close-line');
        }
    })
}

showHidePassword('addUserForm-password', 'addUserForm-eye');
