import { supabase } from "../main.js";

async function fetchServiceName() {
    try {
        const { data, error } = await supabase
            .from('Services')
            .select('name');

        if (error) {
            throw error;
        }

        const serviceDrops = document.querySelectorAll('.drop-service');
        serviceDrops.forEach(dropdown => {
            dropdown.innerHTML = '<option>Service</option>';
            data.forEach(service => {
                const option = document.createElement('option');
                option.value = service.name;
                option.textContent = service.name;
                dropdown.appendChild(option);
            });
        });

    } catch (err) {
        console.error("Error fetching services:", err.message);
    }
}
document.addEventListener('DOMContentLoaded', fetchServiceName);


document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.querySelector(".form-box");
    const reviewButton = reviewForm.querySelector("button");

    reviewButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get input values
        const name = reviewForm.querySelector("input[type='text']").value;
        const barber = reviewForm.querySelector("select:nth-of-type(1)").value;
        const service = reviewForm.querySelector(".drop-service").value;
        const experience = reviewForm.querySelector("textarea").value;
        const rating = reviewForm.querySelector(".rating select").value;

        // Validate input fields
        if (!name || barber === "Select Barber" || service === "Service" || !experience || !rating) {
            alert("Please fill in all fields.");
            return;
        }

        // Insert data into Supabase
        const { data, error } = await supabase.from("Reviews").insert([
            {
                customer_name: name,
                barber_name: barber,
                service_name: service,
                comment: experience,
                rating: parseInt(rating), // Convert rating to an integer
            },
        ]);

        if (error) {
            console.error("Error inserting review:", error.message);
            alert("Failed to submit review. Please try again.");
        } else {
            alert("Review submitted successfully!");
            reviewForm.reset(); // Reset form fields
        }
    });
});
// Initialize EmailJS
document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS
    emailjs.init("5ubOvuijaJO2rgh0M"); 

    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault(); 

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Send email using EmailJS
        emailjs.send("service_u87lcgg", "template_f3q5voq", {
            name: name,
            email: email,
            message: message
        }).then(
            function (response) {
                alert("Message sent successfully!");
                document.getElementById("contact-form").reset(); 
            },
            function (error) {
                alert("Failed to send message. Please try again.");
                console.error("EmailJS Error:", error);
            }
        );
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.querySelector(".ri-user-3-line");
    const dropdown = document.querySelector(".user-dropdown");

    userIcon.addEventListener("click", function () {
        dropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!userIcon.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });
});




