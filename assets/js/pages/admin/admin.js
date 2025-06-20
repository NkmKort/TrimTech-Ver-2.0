// Function to set the active sidebar item and corresponding main content section
function setActive(element) {
    // Remove active class from all sidebar items
    const sidebarItems = document.querySelectorAll('.admin-sidebar-nav-item');
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
        // Save the active section to localStorage
        localStorage.setItem('activeSection', sectionClass);
    }
}

// Set the initial active section based on the active sidebar item or localStorage
document.addEventListener('DOMContentLoaded', () => {
    const activeSectionClass = localStorage.getItem('activeSection');
    if (activeSectionClass) {
        const activeSidebarItem = Array.from(document.querySelectorAll('.admin-sidebar-nav-item')).find(item => {
            const sectionClass = item.textContent.trim().toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
            return sectionClass === activeSectionClass;
        });
        if (activeSidebarItem) {
            setActive(activeSidebarItem);
        }
    } else {
        const activeSidebarItem = document.querySelector('.admin-sidebar-nav-item.active');
        if (activeSidebarItem) {
            setActive(activeSidebarItem);
        }
    }
});
