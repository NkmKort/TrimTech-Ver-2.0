// Function to set the active sidebar item and corresponding main content section
function setActive(element) {
    // Remove active class from all sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
    sidebarItems.forEach(item => item.classList.remove('active'));

    // Add active class to the clicked sidebar item
    element.classList.add('active');

    // Hide all main content sections
    const mainContentSections = document.querySelectorAll('.main > div');
    mainContentSections.forEach(section => section.classList.remove('active'));

    // Show the corresponding main content section
    const sectionClass = element.textContent.trim().toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    const activeSection = document.querySelector(`.main-${sectionClass}`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Set the initial active section based on the active sidebar item
document.addEventListener('DOMContentLoaded', () => {
    const activeSidebarItem = document.querySelector('.sidebar-nav-item.active');
    if (activeSidebarItem) {
        setActive(activeSidebarItem);
    }
});