// Filter Reviews
function filterReviews() {
    const searchInput = document.getElementById('searchReview').value.toLowerCase();
    const reviewTableBody = document.getElementById('reviewsTableBody');
    const rows = reviewTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const reviewerNameCell = rows[i].getElementsByTagName('td')[0];
        const reviewRatingCell = rows[i].getElementsByTagName('td')[1];
        const reviewCommentCell = rows[i].getElementsByTagName('td')[2];
        const reviewBarberCell = rows[i].getElementsByTagName('td')[3];
        const reviewServiceCell = rows[i].getElementsByTagName('td')[4];
        
        const reviewerName = reviewerNameCell.textContent.toLowerCase();
        const reviewRating = reviewRatingCell.textContent.toLowerCase();
        const reviewComment = reviewCommentCell.textContent.toLowerCase();
        const reviewBarber = reviewBarberCell.textContent.toLowerCase();
        const reviewService = reviewServiceCell.textContent.toLowerCase();

        const matchesSearch =
            reviewerName.includes(searchInput) ||
            reviewRating.includes(searchInput) ||
            reviewComment.includes(searchInput) ||
            reviewBarber.includes(searchInput) ||
            reviewService.includes(searchInput);

        if (matchesSearch) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}
