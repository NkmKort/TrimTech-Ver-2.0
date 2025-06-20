import { supabase } from "../main.js";

// Fetch and display Barbers, Services, and Branches as options
async function fetchAndDisplayOptions() {
    try {
        // Fetch Barbers
        const { data: barbers, error: barbersError } = await supabase
            .from('Barbers')
            .select('barber_id, Staff(Users(name))');
        if (barbersError) throw barbersError;

        const barberSelect = document.getElementById('chooseBarber');
        barberSelect.innerHTML = '<option value="">Select Barber</option>';
        barbers.forEach(barber => {
            const option = document.createElement('option');
            option.value = barber.barber_id;
            option.textContent = barber.Staff.Users.name;
            barberSelect.appendChild(option);
        });

        // Fetch Services
        const { data: services, error: servicesError } = await supabase
            .from('Services')
            .select('service_id, name');
        if (servicesError) throw servicesError;

        const serviceSelect = document.getElementById('chooseService');
        serviceSelect.innerHTML = '<option value="">Select Service</option>';
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.service_id;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });

        // Fetch Branches
        const { data: branches, error: branchesError } = await supabase
            .from('Branches')
            .select('branch_id, name');
        if (branchesError) throw branchesError;

        const branchSelect = document.getElementById('chooseBranch');
        branchSelect.innerHTML = '<option value="">Select Branch</option>';
        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.branch_id;
            option.textContent = branch.name;
            branchSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching options:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayOptions);
