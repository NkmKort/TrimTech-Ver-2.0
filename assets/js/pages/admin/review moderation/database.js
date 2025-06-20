import { supabase } from "../../../config/supabase.js";

// Fetch Reviews
async function fetchReviews() {
    const { data, error } = await supabase
        .from('Reviews')
        .select(`
            *,
            Customers(Users(name)),
            Barbers(Staff(Users(name))),
            Services(name)
        `);

    if (error) {
        console.error("Error fetching Reviews:", error);
        return;
    }

    const reviewsTableBody = document.getElementById("reviewsTableBody");
    if (!reviewsTableBody) {
        console.error("Table body element not found!");
        return;
    }

    reviewsTableBody.innerHTML = ""; // Clear existing content

    data.forEach(review => {
        let row = `
            <tr>
                <td>${review.Customers.Users.name}</td>
                <td>${"⭐".repeat(review.rating)}</td>
                <td>${review.comment}</td>
                <td>${review.Barbers.Staff.Users.name}</td>
                <td>${review.Services.name}</td>
                <td>
                    <button class="btn btn-delete btn-red" onclick="deleteFeedback('${review.review_id}')">Delete</button>
                </td>
            </tr>
        `;
        reviewsTableBody.innerHTML += row;
    });

    filterReviews();
}

// Fetch Reviews on div load
document.addEventListener('DOMContentLoaded', () => {
    const reviewModerationSection = document.querySelector('.main-review_moderation');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = reviewModerationSection.classList.contains('active');
                if (isActive) {
                    fetchReviews();
                }
            }
        });
    });

    observer.observe(reviewModerationSection, { attributes: true });
});

// Delete Review
window.deleteFeedback = async function(review_id) {
    console.log("Attempting to delete review with ID:", review_id);

    if (confirm("Are you sure you want to delete this review?")) {
        try {
            const { error } = await supabase
                .from('Reviews')
                .delete()
                .eq('review_id', review_id);

            if (error) throw error;

            console.log("Review deleted successfully!"); 
            fetchReviews(); // Reload table

        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }
};

document.addEventListener("DOMContentLoaded", fetchReviews);
