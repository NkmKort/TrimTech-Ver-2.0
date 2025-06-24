import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

// 🚨 WARNING: Move the key to a secure environment!
const supabaseUrl = "https://dcyaytjualtuwvantpek.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeWF5dGp1YWx0dXd2YW50cGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDU2NjksImV4cCI6MjA1NTc4MTY2OX0.RDsVndAUGJfQN90Ezg_xxoHF-506ST66e7cSzuQ26jM"; // Replace this in an env file!

export const supabase = createClient(supabaseUrl, supabaseKey);

async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        console.log("No user found, updating navbar...");
        updateNavbar(false);
        return null;
    }

    console.log("User found:", data.user);
    updateNavbar(true);
    return data.user;
}

// Function to update the navbar based on authentication status
function updateNavbar(isLoggedIn) {
    const navIcons = document.querySelector(".nav-icons");

    if (!navIcons) return;

    if (isLoggedIn) {
        navIcons.innerHTML = `
            <li><a href="#"><i class="ri-notification-2-line"></i></a></li>
            <li class="nav-dropdown">
                <a href="#" id="userIcon"><i class="ri-user-3-line"></i></a>
                <div class="dropdown-menu" id="dropdownMenu">
                    <button id="editProfileBtn" class="dropdown-btn">Edit Profile</button>
                    <button id="signOutBtn">Sign Out</button>
                </div>
            </li>
            <li><a id="listIcon" href="#"><i class="ri-list-check"></i></a></li>
        `;

        // Reattach event listeners
        setupDropdown();
        setupSignOut();
        setupSidebar();

        // ✅ Attach event listener AFTER updating innerHTML
        document.getElementById("editProfileBtn")?.addEventListener("click", openEditProfileModal);
    } else {
        navIcons.innerHTML = `
            <li><a href="../Form Page/login-page.html" class="login-btn">Log In</a></li>
            <li><a href="../Form Page/login-page.html" class="signup-btn">Sign Up</a></li>
        `;
    }
}

// Function to open edit profile modal
function openEditProfileModal() {
    const user = getUser();
    if (!user) {
        alert("No user logged in!");
        return;
    }
    document.getElementById("editProfileName").value = user.user_metadata?.name || "";
    document.getElementById("editProfileEmail").value = user.email || "";
    document.getElementById("editProfileModal").style.display = "flex";
}


// Handle dropdown menu toggling
function setupDropdown() {
    const userIcon = document.getElementById("userIcon");
    const dropdownMenu = document.getElementById("dropdownMenu");

    
    if (!userIcon || !dropdownMenu) return;

    userIcon.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
}

// Handle user sign out
function setupSignOut() {
    const signOutBtn = document.getElementById("signOutBtn");

    if (!signOutBtn) return;

    signOutBtn.addEventListener("click", async () => {
        console.log("Sign out clicked.");
        const { error } = await supabase.auth.signOut();
        if (!error) {
            console.log("User signed out.");
            localStorage.removeItem("userLoggedIn");
            location.reload(); // Refresh page after logout
        } else {
            console.error("Sign out error:", error.message);
        }
    });
}

// Check user status on page load
getUser();
function setupSidebar() {
    const listIcon = document.getElementById("listIcon");
    const sidebar = document.getElementById("appointmentSidebar");
    const closeSidebar = document.getElementById("closeSidebar");

    if (!listIcon || !sidebar || !closeSidebar) {
        console.error("Sidebar elements missing!");
        return;
    }

    // Open sidebar when clicking list icon
    listIcon.addEventListener("click", function (event) {
        event.preventDefault();
        sidebar.classList.toggle("open");
    });

    // Close sidebar when clicking close button
    closeSidebar.addEventListener("click", function () {
        sidebar.classList.remove("open");
    });
}
let appointmentData = [];

async function fetchAppointments() {
    const user = await getUser(); // Fetch the logged-in user

    if (!user) {
        console.error("No logged-in user found.");
        return;
    }

    const userEmail = user.email; // Get user's email

    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            appointment_id,
            date,
            time,
            appointment_type,
            status,
            Customers(Users(name, email)),
            Barbers(Staff(Users(name))),
            Services(name),
            Branches(name)
        `);

    if (error) {
        console.error("Error fetching appointments:", error);
        return;
    }

    // 🔹 Filter appointments that belong to the logged-in user
    const userAppointments = data.filter(appt => appt.Customers.Users.email === userEmail);

    // Sort appointments by date (ascending)
    appointmentData = userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    displayAppointments(appointmentData);
}

function displayAppointments(appointments) {
    const appointmentList = document.getElementById("appointmentList");

    if (!appointmentList) {
        console.error("Appointment list element not found!");
        return;
    }

    // Clear previous appointments
    appointmentList.innerHTML = "";

    if (appointments.length === 0) {
        appointmentList.innerHTML = "<p>No appointments found.</p>";
        return;
    }

    // Loop through appointments and create cards
    appointments.forEach(appt => {
        const appointmentItem = document.createElement("li");
        appointmentItem.classList.add("appointment-card");
        appointmentItem.innerHTML = `
            <h3>${appt.Services.name}</h3>
            <p><strong>Date:</strong> ${new Date(appt.date).toDateString()}</p>
            <p><strong>Time:</strong> ${appt.time}</p>
            <p><strong>Barber:</strong> ${appt.Barbers.Staff.Users.name}</p>
            <p><strong>Status:</strong> <span class="status">${appt.status}</span></p>
            <button class="cancel-btn" data-id="${appt.appointment_id}">Cancel</button>
        `;
        appointmentList.appendChild(appointmentItem);
    });

    // Attach event listeners to cancel buttons
    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            const appointmentId = event.target.getAttribute("data-id");
            cancelAppointment(appointmentId);
        });
    });
}


async function cancelAppointment(appointmentId) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    const { error } = await supabase
        .from('Appointments')
        .update({ status: "Cancelled" })
        .eq('appointment_id', appointmentId);

    if (error) {
        console.error("Error canceling appointment:", error);
        alert("Failed to cancel appointment.");
    } else {
        alert("Appointment cancelled successfully!");
        fetchAppointments(); // Refresh the list
    }
}

// Load appointments when the sidebar icon is clicked
document.getElementById("listIcon").addEventListener("click", fetchAppointments);

document.addEventListener("DOMContentLoaded", () => {
    const editProfileModal = document.getElementById("editProfileModal");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const closeProfileModal = document.getElementById("closeProfileModal");
    console.log(editProfileModal);
    console.log(editProfileBtn);
    console.log(closeProfileModal);
    if (!editProfileModal || !editProfileBtn || !closeProfileModal) {
        console.error("Modal elements not found! Check IDs in HTML.");
        return;
    }

    editProfileBtn.addEventListener("click", async () => {
        const user = await getUser(); // Fetch current user

        if (!user) {
            alert("No user logged in!");
            return;
        }

        // Populate form with existing user data
        document.getElementById("editProfileName").value = user.user_metadata?.name || "";
        document.getElementById("editProfileEmail").value = user.email || "";

        // Show the modal
        editProfileModal.style.display = "flex";
    });

    // Close modal when clicking "X"
    closeProfileModal.addEventListener("click", () => {
        editProfileModal.style.display = "none";
    });

    // Hide modal when clicking outside the content
    window.addEventListener("click", (event) => {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = "none";
        }
    });

    // Handle form submission to update user info
    document.getElementById("editProfileForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const newName = document.getElementById("editProfileName").value;
        const newEmail = document.getElementById("editProfileEmail").value;

        const { error } = await supabase.auth.updateUser({
            email: newEmail,
            data: { name: newName } // Store name in user metadata
        });

        if (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user information.");
        } else {
            alert("Profile updated successfully!");
            editProfileModal.style.display = "none";
        }
    });
});
