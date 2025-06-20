import { supabase } from "../../../config/supabase.js";

// Fetch Services
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
                    <button class="btn btn-edit btn-green" onclick="editService('${service.service_id}', '${service.name.replace(/'/g, "\\'").replace(/\n/g, " ")}', '${service.description.replace(/'/g, "\\'").replace(/\n/g, " ")}', ${service.price})">Edit</button>
                    <button class="btn btn-delete btn-red" onclick="deleteService('${service.service_id}')">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    filterServices();
}

// Fetch Services on div load
document.addEventListener('DOMContentLoaded', () => {
    const serviceManagementSection = document.querySelector('.main-service_management');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = serviceManagementSection.classList.contains('active');
                if (isActive) {
                    fetchServices();
                }
            }
        });
    });

    observer.observe(serviceManagementSection, { attributes: true });
});

// Edit Service
window.editService = async function(service_id, name, description, price) {
    document.getElementById("editServiceForm-service_id").value = service_id;
    document.getElementById("editServiceForm-serviceName").value = name;
    document.getElementById("editServiceForm-serviceDescription").value = description;
    document.getElementById("editServiceForm-servicePrice").value = price;

    const modal = document.getElementById("editServiceModal");
    if (!modal) {
        console.error("Edit modal not found!");
        return;
    }

    modal.style.display = "block"; 
}

document.getElementById("submitEditService").onclick = async function(event) {
    event.preventDefault();

    if (confirm("Are you sure you want to update this service?")) {
        const service_id = document.getElementById("editServiceForm-service_id").value;
        const serviceName = document.getElementById("editServiceForm-serviceName").value.trim();
        const serviceDescription = document.getElementById("editServiceForm-serviceDescription").value.trim();
        const servicePrice = parseFloat(document.getElementById("editServiceForm-servicePrice").value);

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
                .eq("service_id", service_id);

            if (error) throw error;

            fetchServices(); // Refresh the table
            closeEditServiceModal();
        } catch (err) {
            console.error("Error updating service:", err);
        }
    }
};

// Delete Service
window.deleteService = async function(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
        try {
            const { error } = await supabase
                .from('Services')
                .delete()
                .eq('service_id', service_id);

            if (error) throw error;

            console.log("Service deleted successfully!"); // Confirm successful deletion
            fetchServices(); // Reload table

        } catch (err) {
            console.error("Error deleting service:", err);
        }
    }
};

document.getElementById("addServiceForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const serviceName = document.getElementById("addServiceForm-serviceName").value.trim();
    const serviceDescription = document.getElementById("addServiceForm-serviceDescription").value.trim();
    const servicePrice = parseFloat(document.getElementById("addServiceForm-servicePrice").value);

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
