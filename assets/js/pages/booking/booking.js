import { supabase } from "../../config/supabase.js";

let selectedDate = null;

async function getUserId() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Error getting user:", error);
        return null;
    }
    return user ? user.id : null;
}

function generateCalendar(month, year) {
    const calendarDiv = document.getElementById("calendar");
    calendarDiv.innerHTML = "";
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.textContent = i;
        dayDiv.addEventListener("click", () => {
            selectedDate = new Date(year, month, i);
            highlightSelectedDate();
        });
        calendarDiv.appendChild(dayDiv);
    }
}

function highlightSelectedDate() {
    document.querySelectorAll(".calendar div").forEach(div => div.classList.remove("selected"));
    document.querySelector(`.calendar div:nth-child(${selectedDate.getDate()})`).classList.add("selected");
}

document.getElementById("bookBtn").addEventListener("click", async () => {
    const user_id = await getUserId();
    if (!user_id) {
        document.getElementById("message").innerHTML = "<p class='error-message'>Please log in first!</p>";
        return;
    }

    if (!selectedDate) {
        document.getElementById("message").innerHTML = "<p class='error-message'>Please select a date!</p>";
        return;
    }

    const time = document.getElementById("time").value;
    const service_id = document.getElementById("chooseService").value;
    const branch_id = document.getElementById("chooseBranch").value;
    const barber_id = document.getElementById("chooseBarber").value;

    if (!time || !service_id || !barber_id) {
        document.getElementById("message").innerHTML = "<p class='error-message'>Please select time, service, and barber.</p>";
        return;
    }

    const appointment_type = "Booked";

    const { data, error } = await supabase.from("Appointments").insert([{
        customer_id: user_id,  
        service_id: service_id,
        branch_id: branch_id,
        barber_id: barber_id,
        appointment_type: appointment_type,
        date: selectedDate.toISOString().split('T')[0],
        time: time,
    }]);

    document.getElementById("message").innerHTML = error 
        ? `<p class='error-message'>${error.message}</p>` 
        : "<p class='success-message'>Appointment booked successfully!</p>";
});

const today = new Date();
generateCalendar(today.getMonth(), today.getFullYear());

document.getElementById("exitBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});
