import { isAdmin, getCurrentSession } from "../auth/session.js";
import { supabase } from "../config/supabase.js";

let timeFormat = "24"; // default

document.addEventListener("DOMContentLoaded", async function () {
    const navItems = document.querySelector(".nav-items"); // Select the nav-items container
    const navIcons = document.querySelector(".nav-icons");
    const session = await getCurrentSession();

    if (session) {
        if (await isAdmin()) {
            // If the user is an admin, show the admin dashboard link
            const adminNavItem = document.createElement("li");
            adminNavItem.innerHTML = '<a href="admin.html">Admin Dashboard</a>';
            navItems.appendChild(adminNavItem); // Append to nav-items instead of nav-icons
        }

        // Update existing user icon instead of adding a new one
        const userIcon = document.querySelector(".nav-dropdown");
        if (userIcon) {
            userIcon.innerHTML = `
                <a href="#" id="userIcon"><i class="ri-user-3-line"></i></a>
                <div class="dropdown-menu" id="dropdownMenu">
                    <button id="signOutBtn">Sign Out</button>
                </div>
            `;
        }
    } else {
        // If no user is logged in, show Log In and Sign Up buttons
        navIcons.innerHTML = `
            <li><a href="signup.html" >Log In</a></li>
            <li><a href="signup.html" >Sign Up</a></li>
        `;
    }

    // Dropdown toggle
    const userIcon = document.getElementById("userIcon");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const signOutBtn = document.getElementById("signOutBtn");

    if (userIcon && dropdownMenu) {
        userIcon.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", function (event) {
            if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    } else {
        console.error("User icon or dropdown menu not found.");
    }

    // Sign out functionality
    if (signOutBtn) {
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
    setupSidebar();
});

document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector("#user-icon");
    const dropdown = document.querySelector(".user-dropdown");



    if (userIcon && dropdown) {
        userIcon.addEventListener("click", (event) => {
            event.preventDefault();
            dropdown.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target) && event.target !== userIcon) {
                dropdown.classList.remove("active");
            }
        });
    } else {
        console.error("User icon or dropdown menu not found.");
    }

    // Sign out functionality
    const signOutBtn = document.querySelector("#sign-out");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Error signing out:", error.message);
            } else {
                window.location.href = "index.html"; // Redirect to login page
            }
        });
    }
});

//View appointments 

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
    const session = await getCurrentSession(); // Fetch session instead of just user

    if (!session || !session.user) {
        console.error("No logged-in user found.");
        return;
    }

    const userEmail = session.user.email;

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
    const userAppointments = data.filter(
        appt => appt?.Customers?.Users?.email === userEmail
    );

    console.log("Fetched appointments:", data);

    // Sort appointments by date (ascending)
    appointmentData = userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    displayAppointments(appointmentData);
}

function formatTime(timeString) {
    if (timeFormat === "24") return timeString;

    const [hour, minute] = timeString.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;
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
    appointments.sort((a, b) => {
        const statusOrder = { pending: 1, completed: 2, cancelled: 3 };
        return (statusOrder[a.status.toLowerCase()] || 99) - (statusOrder[b.status.toLowerCase()] || 99);
    });
    // Loop through appointments and create cards
    appointments.forEach(appt => {
        const appointmentItem = document.createElement("li");
        appointmentItem.classList.add("appointment-card");
        appointmentItem.innerHTML = `
            <h3>${appt.Services.name}</h3>
            <p><strong>Date:</strong> ${new Date(appt.date).toDateString()}</p>
            <p><strong>Time:</strong> ${formatTime(appt.time)}</p>
            <p><strong>Barber:</strong> ${appt.Barbers.Staff.Users.name}</p>
            <p><strong>Status:</strong> <span class="status">${appt.status}</span></p>
        `;

        // ✅ Append the cancel button only if the appointment is NOT "Completed"
        if (appt.status.toLowerCase() !== "completed" && appt.status.toLowerCase() !== "cancelled") {
            const cancelButton = document.createElement("button");
            cancelButton.classList.add("cancel-btn");
            cancelButton.setAttribute("data-id", appt.appointment_id);
            cancelButton.textContent = "Cancel";

            cancelButton.addEventListener("click", async (event) => {
                const appointmentId = event.target.getAttribute("data-id");
                cancelAppointment(appointmentId);
            });

            appointmentItem.appendChild(cancelButton); // ✅ Append instead of replacing innerHTML

        }
        appointmentList.appendChild(document.createElement("br"));
        appointmentList.appendChild(document.createElement("hr"));
        appointmentList.appendChild(document.createElement("br"));
        appointmentList.appendChild(appointmentItem);
    });

    // Attach event listeners to cancel buttons
    //document.querySelectorAll(".cancel-btn").forEach(button => {
    //    button.addEventListener("click", async (event) => {
    //        const appointmentId = event.target.getAttribute("data-id");
    //        cancelAppointment(appointmentId);
    //    });
    //});
}

let selectedAppointmentId = null;

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Globally exposed so it works with onclick=""
    window.closeCancelModal = function () {
        document.getElementById("cancelModal").style.display = "none";
        document.getElementById("cancelForm").reset();
        document.getElementById("otherReason").value = "";
        document.getElementById("otherReason").disabled = true;
    };

    // ✅ Enable/disable 'Other' input field
    const reasonRadios = document.querySelectorAll('input[name="reason"]');
    reasonRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            const isOther = radio.value === "Other";
            const otherInput = document.getElementById("otherReason");
            otherInput.disabled = !isOther;
            if (!isOther) otherInput.value = "";
        });
    });



    // ✅ Handle form submission
    document.getElementById("cancelForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const selectedReason = document.querySelector('input[name="reason"]:checked');
        if (!selectedReason) {
            alert("Please select a reason for cancellation.");
            return;
        }

        let reason = selectedReason.value;
        if (reason === "Other") {
            const otherText = document.getElementById("otherReason").value.trim();
            if (!otherText) {
                alert("Please provide a reason.");
                return;
            }
            reason = otherText;
        }

        const { error } = await supabase
            .from('Appointments')
            .update({
                status: "Cancelled",
                cancellation_reason: reason
            })
            .eq('appointment_id', selectedAppointmentId);

        if (error) {
            console.error("Error canceling appointment:", error);
            alert("Failed to cancel appointment.");
        } else {
            alert("Appointment cancelled successfully!");
            fetchAppointments();
            closeCancelModal();
        }
    });
});

// ✅ This function shows the modal and sets the current appointment ID
function cancelAppointment(appointmentId) {
    selectedAppointmentId = appointmentId;
    document.getElementById("cancelModal").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function () {
    // Set the default toggle switch state
    const timeToggle = document.getElementById("timeFormatToggle");
    const formatLabel = document.getElementById("formatLabel");

    // Initialize toggle based on current timeFormat
    if (timeFormat === "12") {
        timeToggle.checked = true;
        formatLabel.textContent = "12H";
    } else {
        timeToggle.checked = false;
        formatLabel.textContent = "24H";
    }

    // Handle switch change
    timeToggle.addEventListener("change", () => {
        if (timeToggle.checked) {
            timeFormat = "12";
            formatLabel.textContent = "12H";
        } else {
            timeFormat = "24";
            formatLabel.textContent = "24H";
        }
        displayAppointments(appointmentData);
    });

    // Optional: fetchAppointments() should still be called here
    fetchAppointments();
});



// Load appointments when the sidebar icon is clicked
document.getElementById("listIcon").addEventListener("click", fetchAppointments);
