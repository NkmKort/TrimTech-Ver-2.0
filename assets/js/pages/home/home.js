const slider = document.querySelector('.slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let index = 0;

nextBtn.addEventListener('click', () => {
    if (index < 2) {  
        index++;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }
});

prevBtn.addEventListener('click', () => {
    if (index > 0) {
        index--;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }
});
