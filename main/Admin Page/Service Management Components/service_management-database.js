import { supabase } from "../../main.js";

// Services Management Functions //
async function fetchServices() {
    const { data, error } = await supabase
        .from('Services')
        .select('*');

    if (error) {
        console.error("Error fetching services:", error);
        return;
    }

    const tableBody = document.getElementById("serviceTableBody");
    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing content

    data.forEach(service => {
        let row = `
            <tr>
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td>Php ${service.price.toFixed(2)}</td>
                <td>
                    <button class="btn-delete" onclick="editService('${service.service_id}', '${service.name.replace(/'/g, "\\'").replace(/\n/g, " ")}', '${service.description.replace(/'/g, "\\'").replace(/\n/g, " ")}', ${service.price})">Edit</button>
                    <button class="btn-delete" onclick="deleteService('${service.service_id}')">Delete</button>
                </td>
            </tr>
        `;
    
        tableBody.innerHTML += row;
    });
}
window.editService = function(serviceId, name, description, price) {

    document.getElementById("editServiceId").value = serviceId;
    document.getElementById("editServiceName").value = name;
    document.getElementById("editServiceDescription").value = description;
    document.getElementById("editServicePrice").value = price;

    const modal = document.getElementById("editServiceModal");
    if (!modal) {
        console.error("Edit modal not found!");
        return;
    }

    modal.style.display = "block"; 
}

document.getElementById("editServiceForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const serviceId = document.getElementById("editServiceId").value;
    const serviceName = document.getElementById("editServiceName").value.trim();
    const serviceDescription = document.getElementById("editServiceDescription").value.trim();
    const servicePrice = parseFloat(document.getElementById("editServicePrice").value);

    if (!serviceName || !serviceDescription || isNaN(servicePrice)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        const { error } = await supabase
            .from("Services")
            .update({
                name: serviceName,
                description: serviceDescription,
                price: servicePrice
            })
            .eq("service_id", serviceId);

        if (error) throw error;

        fetchServices(); // Refresh the table
        closeEditModal(); // Close modal

    } catch (err) {
        console.error("Error updating service:", err);
    }
});

window.deleteService = async function(serviceId) {
    try {
        const { error } = await supabase
            .from('Services')
            .delete()
            .eq('service_id', serviceId);

        if (error) throw error;

        console.log("Service deleted successfully!"); // Confirm successful deletion
        fetchServices(); // Reload table

    } catch (err) {
        console.error("Error deleting service:", err);
    }
};


document.getElementById("addServiceForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const serviceName = document.getElementById("serviceName").value.trim();
    const serviceDescription = document.getElementById("serviceDescription").value.trim();
    const servicePrice = parseFloat(document.getElementById("servicePrice").value);

    if (!serviceName || !serviceDescription || isNaN(servicePrice)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        const { error } = await supabase
            .from("Services")
            .insert([{ 
                name: serviceName, 
                description: serviceDescription, 
                price: servicePrice 
            }]);

        if (error) throw error;

        fetchServices(); // Reload the table after adding
        closeAddServiceModal();
        document.getElementById("addServiceForm").reset();

    } catch (err) {
        console.error("Error adding service:", err);
    }
});

// Ensure services load when the page is ready
document.addEventListener("DOMContentLoaded", fetchServices);

// END OF SERVICES //

// Review Moderation System Logic //
async function fetchReviews() {
    const { data, error } = await supabase
        .from('Reviews')
        .select('*');

    if (error) {
        console.error("Error fetching Reviews:", error);
        return;
    }

    const tableBody = document.getElementById("reviewTableBody");
    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing content

    data.forEach(review => {
        let row = `
            <tr>
                <td>${review.customer_name}</td>
                <td>${"⭐".repeat(review.rating)}</td>
                <td>${review.comment}</td>
                <td>${review.barber_name}</td>
                <td>${review.service_name}</td>
                <td>
                    <button class="btn-delete" onclick="deleteFeedback('${review.review_id}')">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

window.deleteFeedback = async function(reviewId) {
    console.log("Attempting to delete review with ID:", reviewId);

    if (confirm("Are you sure you want to delete this review?")) {

        try {
            const { error } = await supabase
                .from('Reviews')
                .delete()
                .eq('review_id', reviewId);

            if (error) throw error;

            console.log("Review deleted successfully!"); 
            fetchReviews(); // Reload table

        } catch (err) {
            console.error("Error deleting review:", err);
        }
    }
};
document.addEventListener("DOMContentLoaded", fetchReviews);
