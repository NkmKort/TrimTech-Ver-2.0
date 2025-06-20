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

// Fetch Users
async function fetchUsers() {
    const { data, error } = await supabase
        .from('Users')
        .select('*');

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    const tableBody = document.getElementById("userTableBody");
    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing content

    data.forEach(user => {
        let row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-edit btn-green" onclick="editUser('${user.user_id}')">Edit</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    filterUsers();
}

// Fetch Users on div load
document.addEventListener('DOMContentLoaded', () => {
    const userManagementSection = document.querySelector('.main-user_management');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = userManagementSection.classList.contains('active');
                if (isActive) {
                    fetchUsers();
                }
            }
        });
    });

    observer.observe(userManagementSection, { attributes: true });
});

// Add User
document.getElementById('submitAddUser').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("Save User clicked");

    const name = document.getElementById('addUserForm-name').value;
    const email = document.getElementById('addUserForm-email').value;
    const phone = document.getElementById('addUserForm-phone').value;
    const password = document.getElementById('addUserForm-password').value;
    const role = document.getElementById('addUserForm-role').value;
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: name,
                phone: phone,
                role: role
            },
            email_confirm: true
        }
      });

      if (error) throw error;

      console.log("Added User Successfully");
      showMessage("Added User  Successfully", "addUserMessage");
      fetchUsers(); // Refresh the table
      document.getElementById('addUserModal').style.display = 'none';
    } catch (error) {
      console.error("Error during adding: ", error.message);
      showMessage("Unable to create User: " + error.message, "addUserMessage");
    }
});

// Update User
async function updateUser(user_id, name, phone, role) {
    const { data, error } = await supabase
        .from('Users')
        .update({
            name,
            phone,
            role
        })
        .eq('user_id', user_id)
        .select();

    if (error) {
        console.error("Error updating user:", error);
        return;
    }

    console.log("User updated:", data);
    await fetchUsers(); // Refresh the table
    document.getElementById('editUserModal').style.display = 'none';
}

// Edit User
window.editUser = async function(user_id) {
    console.log("Edit User clicked");

    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) {
        console.error("Error fetching user:", error);
        return;
    }

    if (!data) {
        console.error("User not found!");
        return;
    }

    console.log("User found: ", data);

    document.getElementById('editUserForm-name').value = data.name;
    document.getElementById('editUserForm-phone').value = data.phone;
    document.getElementById('editUserForm-role').value = data.role;

    openEditUserModal();
    
    document.getElementById('submitEditUser').onclick = async function(event) {
        event.preventDefault();
        console.log("Save User clicked");

        if (confirm("Are you sure you want to update this user?")) {
            const name = document.getElementById('editUserForm-name').value;
            const phone = document.getElementById('editUserForm-phone').value;
            const role = document.getElementById('editUserForm-role').value;

            console.log("Updating user: ", user_id, name, phone, role);

            await updateUser(user_id, name, phone, role);
        }
    }
}

document.addEventListener("DOMContentLoaded", fetchUsers);
