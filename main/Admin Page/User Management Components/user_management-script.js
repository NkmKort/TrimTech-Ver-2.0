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

const showHidePassword = (signUpPass, signUpEye) => {
    const passInput = document.getElementById(signUpPass),
            eyeIcon = document.getElementById(signUpEye)

    eyeIcon.addEventListener('click', () => {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            eyeIcon.classList.add('ri-eye-2-line');
            eyeIcon.classList.remove('ri-eye-close-line');
        } else {
            passInput.type = 'password';
            eyeIcon.classList.remove('ri-eye-2-line');
            eyeIcon.classList.add('ri-eye-close-line');
        }
    })
}

showHidePassword('signup-password', 'signup-eye');

document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.querySelector('.signup-form');
    const showSignUp = document.getElementById('show-signup');

    showSignUp.addEventListener('click', function(e) {
        e.preventDefault();
        signUpForm.reset();
    });
});

function filterUsers() {
    const searchInput = document.getElementById('searchUser').value.toLowerCase();
    const filterRole = document.getElementById('filterRole').value;
    const userTableBody = document.getElementById('userTableBody');
    const rows = userTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[0];
        const emailCell = rows[i].getElementsByTagName('td')[1];
        const roleCell = rows[i].getElementsByTagName('td')[3];

        const name = nameCell.textContent.toLowerCase();
        const email = emailCell.textContent.toLowerCase();
        const role = roleCell.textContent.toLowerCase();

        const matchesSearch = name.includes(searchInput) || email.includes(searchInput);
        const matchesRole = filterRole === '' || role.includes(filterRole);

        if (matchesSearch && matchesRole) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}