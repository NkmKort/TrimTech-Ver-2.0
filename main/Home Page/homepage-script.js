import { supabase } from "../main.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Checking elements...");

    const userIcon = document.getElementById("userIcon");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const signOutBtn = document.getElementById("signOutBtn");

    console.log("userIcon:", userIcon);
    console.log("dropdownMenu:", dropdownMenu);
    console.log("signOutBtn:", signOutBtn);

    if (!userIcon || !dropdownMenu || !signOutBtn) {
        console.error("Dropdown elements missing. Check HTML structure.");
        return;
    }

    // Ensure dropdown is hidden initially
    dropdownMenu.style.display = "none";

    userIcon.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("User icon clicked! Toggling dropdown.");

        if (dropdownMenu.style.display === "block") {
            dropdownMenu.style.display = "none";
            console.log("Dropdown closed.");
        } else {
            dropdownMenu.style.display = "block";
            console.log("Dropdown opened.");
        }
    });

    document.addEventListener("click", function (event) {
        if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target) && dropdownMenu.style.display === "block") {
            console.log("Clicked outside. Closing dropdown.");
            dropdownMenu.style.display = "none";
        }
    });

    signOutBtn.addEventListener("click", async () => {
        console.log("Sign out clicked.");
        const { error } = await supabase.auth.signOut();
        if (!error) {
            console.log("User signed out.");
            localStorage.removeItem("userLoggedIn"); // Remove stored session
            location.reload(); // Refresh page after logout
        } else {
            console.error("Sign out error:", error.message);
        }
    });
});
