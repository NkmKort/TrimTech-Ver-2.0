import { supabase } from '../../../config/supabase.js';

// Function to fetch daily report
async function fetchDailyReport() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('Appointments')
        .select('*')
        .eq('date', today)
        .in('status', ['Completed', 'Extended']);

    if (error) {
        console.error('Error fetching daily report:', error);
        return;
    }

    const totalRevenue = data.reduce((sum, appointment) => sum + appointment.cost, 0);
    const totalAppointments = data.length;

    const customerIds = data.map(appointment => appointment.customer_id);
    const uniqueCustomerIds = [...new Set(customerIds)];

    const { data: allAppointments, error: allAppointmentsError } = await supabase
        .from('Appointments')
        .select('customer_id')
        .lt('date', today)
        .in('status', ['Completed', 'Extended']);

    if (allAppointmentsError) {
        console.error('Error fetching all appointments:', allAppointmentsError);
        return;
    }

    const returningCustomers = uniqueCustomerIds.filter(customerId =>
        allAppointments.some(appointment => appointment.customer_id === customerId)
    ).length;

    const newCustomers = uniqueCustomerIds.length - returningCustomers;

    document.getElementById('dailyTotalRevenue').textContent = `Php ${totalRevenue.toFixed(2)}`;
    document.getElementById('dailyTotalAppointments').textContent = totalAppointments;
    document.getElementById('dailyReturningCustomers').textContent = returningCustomers;
    document.getElementById('dailyNewCustomers').textContent = newCustomers;
}

// Function to fetch monthly report
async function fetchMonthlyReport() {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

    const { data, error } = await supabase
        .from('Appointments')
        .select('*')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .in('status', ['Completed', 'Extended']);

    if (error) {
        console.error('Error fetching monthly report:', error);
        return;
    }

    const totalRevenue = data.reduce((sum, appointment) => sum + appointment.cost, 0);
    const totalAppointments = data.length;

    const customerIds = data.map(appointment => appointment.customer_id);
    const uniqueCustomerIds = [...new Set(customerIds)];

    const { data: allAppointments, error: allAppointmentsError } = await supabase
        .from('Appointments')
        .select('customer_id')
        .lt('date', startOfMonth)
        .in('status', ['Completed', 'Extended']);

    if (allAppointmentsError) {
        console.error('Error fetching all appointments:', allAppointmentsError);
        return;
    }

    const returningCustomers = uniqueCustomerIds.filter(customerId =>
        allAppointments.some(appointment => appointment.customer_id === customerId)
    ).length;

    // Check for customers with multiple bookings within the same month
    const monthlyReturningCustomers = uniqueCustomerIds.filter(customerId =>
        data.filter(appointment => appointment.customer_id === customerId).length > 1
    ).length;

    const newCustomers = uniqueCustomerIds.length - returningCustomers;

    document.getElementById('monthlyTotalRevenue').textContent = `Php ${totalRevenue.toFixed(2)}`;
    document.getElementById('monthlyTotalAppointments').textContent = totalAppointments;
    document.getElementById('monthlyReturningCustomers').textContent = monthlyReturningCustomers;
    document.getElementById('monthlyNewCustomers').textContent = newCustomers;
}

// Function to fetch and display appointments by barber
async function fetchAppointmentsByBarber() {
    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            barber_id,
            Barbers(Staff(Users(name))),
            count:appointment_id
        `)
        .in('status', ['Completed', 'Extended']);

    if (error) {
        console.error('Error fetching appointments by barber:', error);
        return;
    }

    const barberCounts = data.reduce((acc, appointment) => {
        acc[appointment.Barbers.Staff.Users.name] = (acc[appointment.Barbers.Staff.Users.name] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(barberCounts);
    const counts = Object.values(barberCounts);

    const barberChart = document.getElementById('barberChart').getContext('2d');
    new Chart(barberChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Appointments',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to fetch and display popular services
async function fetchPopularServices() {
    const { data, error } = await supabase
        .from('Appointments')
        .select(`
            service_id,
            Services(name),
            count:appointment_id
        `)
        .in('status', ['Completed', 'Extended']);

    if (error) {
        console.error('Error fetching popular services:', error);
        return;
    }

    const serviceCounts = data.reduce((acc, appointment) => {
        acc[appointment.Services.name] = (acc[appointment.Services.name] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(serviceCounts);
    const counts = Object.values(serviceCounts);

    const serviceChart = document.getElementById('serviceChart').getContext('2d');
    new Chart(serviceChart, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Done',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Fetch on div load
document.addEventListener('DOMContentLoaded', () => {
    const reportsAnalyticsSection = document.querySelector('.main-reports_analytics');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = reportsAnalyticsSection.classList.contains('active');
                if (isActive) {
                    fetchDailyReport();
                    fetchMonthlyReport();
                }
            }
        });
    });

    observer.observe(reportsAnalyticsSection, { attributes: true });
});

// Function to export report as CSV
function exportReport() {
    // Implement CSV export logic here
}

// Fetch and display reports on page load
fetchDailyReport();
fetchMonthlyReport();
fetchAppointmentsByBarber();
fetchPopularServices();
