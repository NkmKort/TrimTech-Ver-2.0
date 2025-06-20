const showHidePassword = (loginPass, loginEye) => {
    const passInput = document.getElementById(loginPass),
            eyeIcon = document.getElementById(loginEye)

    eyeIcon.addEventListener('click', () => {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            eyeIcon.classList.add('ri-eye-2-line');
            eyeIcon.classList.remove('ri-eye-close-line');
        } else {
            passInput.type = 'password';
            eyeIcon.classList.remove('ri-eye-2-line');
            eyeIcon.classList.add('ri-eye-close-line');
        }
    })
}

showHidePassword('login-password', 'login-eye');
showHidePassword('signup-password', 'signup-eye');

function adjustZoom() {
    let zoomLevel = Math.round(window.devicePixelRatio * 100);
    
    if (zoomLevel === 90) {
        document.body.style.transform = "scale(1.11)";
        document.body.style.transformOrigin = "top left";
    } else {
        document.body.style.transform = "scale(1)";
    }
}

window.addEventListener("resize", adjustZoom);
adjustZoom();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const signUpForm = document.querySelector('.signup-form');
    const showSignUp = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');


    showSignUp.addEventListener('click', function(e) {
        e.preventDefault();
        signUpForm.reset();
        loginForm.classList.remove('active');
        loginForm.classList.add('hidden');
        signUpForm.classList.remove('hidden');
        signUpForm.classList.add('active');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.reset();
        signUpForm.classList.remove('active');
        signUpForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.classList.add('active');
    });
});