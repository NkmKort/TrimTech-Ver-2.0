import { supabase } from '../../../config/supabase.js';

// Function to fetch daily revenue
async function fetchDailyRevenue() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('Appointments')
        .select('cost')
        .eq('date', today)
        .in('status', ['Completed', 'Extended']);

    if (error) {
        console.error('Error fetching daily revenue:', error);
        return;
    }

    const totalRevenue = data.reduce((sum, appointment) => sum + appointment.cost, 0);
    document.getElementById('overviewDailyRevenue').textContent = `Php ${totalRevenue.toFixed(2)}`;
}

// Function to fetch monthly revenue
async function fetchMonthlyRevenue() {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

    const { data, error } = await supabase
        .from('Appointments')
        .select('cost')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .in('status', ['Completed', 'Extended']);

    if (error) {
        console.error('Error fetching monthly revenue:', error);
        return;
    }

    const totalRevenue = data.reduce((sum, appointment) => sum + appointment.cost, 0);
    document.getElementById('overviewMonthlyRevenue').textContent = `Php ${totalRevenue.toFixed(2)}`;
}

// Function to fetch upcoming appointments and appointments within the next 7 days
async function fetchUpcomingAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysISO = next7Days.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            appointment_id,
            customer_id,
            barber_id,
            service_id,
            branch_id,
            date,
            time,
            Customers(Users(name)),
            Barbers(Staff(Users(name))),
            Services(name),
            Branches(name)
        `)
        .gte('date', today)
        .lte('date', next7DaysISO)
        .in('status', ['Pending', 'Confirmed']);

    if (error) {
        console.error('Error fetching upcoming appointments:', error);
        return;
    }

    const totalAppointments = data.length;
    document.getElementById('overviewUpcomingAppointments').textContent = totalAppointments;

    const tableBody = document.getElementById('overviewUpcomingAppointmentsTableBody');
    tableBody.innerHTML = '';
    data.forEach(appointment => {
        const formattedTime = appointment.time.split('.')[0]; // Remove decimal points after seconds
        const customerName = appointment.Customers?.Users?.name || 'Deleted';
        const barberName = appointment.Barbers?.Staff?.Users?.name || 'Deleted';
        const serviceName = appointment.Services?.name || 'Deleted';
        const branchName = appointment.Branches?.name || 'Deleted';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customerName}</td>
            <td>${barberName}</td>
            <td>${serviceName}</td>
            <td>${branchName}</td>
            <td>${appointment.date}</td>
            <td>${formattedTime}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch on div load
document.addEventListener('DOMContentLoaded', () => {
    const overviewSection = document.querySelector('.main-overview');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = overviewSection.classList.contains('active');
                if (isActive) {
                    fetchDailyRevenue();
                    fetchMonthlyRevenue();
                    fetchUpcomingAppointments();
                }
            }
        });
    });

    observer.observe(overviewSection, { attributes: true });
});

// Fetch and display data on page load
fetchDailyRevenue();
fetchMonthlyRevenue();
fetchUpcomingAppointments();
