// Filter Reviews
function filterReviews() {
    const searchInput = document.getElementById('searchReview').value.toLowerCase();
    const selectedRating = document.getElementById('filterRating')?.value || "";
    const reviewTableBody = document.getElementById('reviewsTableBody');
    const rows = reviewTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const reviewerName = cells[0].textContent.toLowerCase();
        const reviewStars = cells[1].textContent.trim(); // e.g. "⭐⭐⭐"
        const reviewRating = reviewStars.length; // Number of stars
        const reviewComment = cells[2].textContent.toLowerCase();
        const reviewBarber = cells[3].textContent.toLowerCase();
        const reviewService = cells[4].textContent.toLowerCase();

        const matchesSearch =
            reviewerName.includes(searchInput) ||
            reviewComment.includes(searchInput) ||
            reviewBarber.includes(searchInput) ||
            reviewService.includes(searchInput);

        const matchesRating = !selectedRating || parseInt(selectedRating) === reviewRating;

        if (matchesSearch && matchesRating) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

