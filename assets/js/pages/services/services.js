import { supabase } from "../../config/supabase.js";

async function fetchServices() {
    const { data, error } = await supabase
        .from('Services') // Table name
        .select('*'); // Get all columns

    if (error) {
        console.error("Error fetching services:", error);
        return;
    }

    // Select only the "Our Services" section (the second .gallery-container)
    const galleryContainers = document.querySelectorAll('.gallery-container');
    const servicesContainer = galleryContainers[0]; // Assuming the second one is for services

    servicesContainer.innerHTML = ''; // Clear existing content

    // Loop through services and create HTML elements dynamically
    data.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.classList.add('gallery-item');

        // Construct image name from service name (ensure it matches your actual file names)
        const imageName = service.name.toLowerCase().replace(/\s+/g, '') + ".jpg";

        serviceItem.innerHTML = `
            <img src="assets/images/${imageName}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p>Php. ${service.price.toFixed(2)}<br>${service.description || 'No description available.'}</p>
        `;

        // Append to the correct gallery container
        servicesContainer.appendChild(serviceItem);
        });
}

// Fetch services when the page loads
document.addEventListener('DOMContentLoaded', fetchServices);
