import { supabase } from "../../config/supabase.js";

async function fetchServiceName() {
    try {
        const { data, error } = await supabase
            .from('Services')
            .select(`
                service_id,
                name
            `);

        if (error) {
            throw error;
        }

        const serviceDrops = document.querySelectorAll('.drop-service');
        serviceDrops.forEach(dropdown => {
            dropdown.innerHTML = '<option>Select Service</option>';
            data.forEach(service => {
                const option = document.createElement('option');
                option.value = service.service_id;
                option.textContent = service.name;
                dropdown.appendChild(option);
            });
        });

    } catch (err) {
        console.error("Error fetching services:", err.message);
    }
}

async function fetchBarberName() {
    try {
        const { data, error } = await supabase
            .from('Barbers')
            .select(`
                barber_id,
                Staff(Users(name))
            `);

        if (error) {
            throw error;
        }

        const barberDrops = document.querySelectorAll('.drop-barber');
        barberDrops.forEach(dropdown => {
            dropdown.innerHTML = '<option>Select Barber</option>';
            data.forEach(barber => {
                const option = document.createElement('option');
                option.value = barber.barber_id;
                option.textContent = barber.Staff.Users.name;
                dropdown.appendChild(option);
            });
        });

    } catch (err) {
        console.error("Error fetching barbers:", err.message);
    }
}

// Fetch Customer ID based on email
async function fetchCustomerId(email) {
    try {
        const { data, error } = await supabase
            .from('Users')
            .select('user_id')
            .eq('email', email)
            .single();

        if (error) {
            throw error;
        }

        return data.user_id;
    } catch (error) {
        console.error("Error fetching customer name:", error.message);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', fetchServiceName);
document.addEventListener('DOMContentLoaded', fetchBarberName);

document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.querySelector(".form-review");
    const reviewButton = reviewForm.querySelector("button");

    reviewButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get input values
        const email = document.getElementById("review_email").value;
        const barber_id = reviewForm.querySelector(".drop-barber").value;
        const service_id = reviewForm.querySelector(".drop-service").value;
        const experience = reviewForm.querySelector("textarea").value;
        const rating = reviewForm.querySelector(".rating select").value;

        // Validate input fields
        if (!email || barber_id === "" || service_id === "" || !experience || !rating) {
            alert("Please fill in all fields.");
            return;
        }

        const customer_id = await fetchCustomerId(email); // Await the fetchCustomerId function
        if (!customer_id) {
            alert("Customer not found. Please sign up using the email.");
            return;
        }

        // Insert data into Supabase
        const { data, error } = await supabase.from("Reviews").insert([
            {
                customer_id: customer_id,
                barber_id: barber_id,
                service_id: service_id,
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
