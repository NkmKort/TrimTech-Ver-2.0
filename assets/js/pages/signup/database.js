import { signUp, login, forgotPassword } from "../../auth/auth.js";

// Message div
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);

    if (!messageDiv) {
        console.error("Message div not found: " + divId);
        return;
    }

    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign Up
const signUpButton = document.getElementById('submitSignup');
signUpButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("Signup clicked");

    const name = document.getElementById('rName').value;
    const email = document.getElementById('rEmail').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;

    try {
        // Proceed with signup
        const { data, error } = await signUp(email, password, name, phone);

        if (error) {
            console.error("Signup Error:", error.message); // Log the exact error
            if (error.message.includes("User already registered")) {
                showMessage("Email is already in use", "signUpMessage");
            } else {
                showMessage("Unable to create User: " + error.message, "signUpMessage");
            }
            return; // Stop further execution
        }

        showMessage("User Registered Successfully", "signUpMessage");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error during signup: ", error.message);
        showMessage("Unable to create User: " + error.message, "signUpMessage");
    }
});

// Sign In
const signInButton = document.getElementById('submitSignIn');
signInButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("Signin clicked");

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Sign in the user with Supabase Auth
        const { data, error } = await login(email, password);

        if (error) throw error;

        showMessage("User Logged In Successfully", "signInMessage");

        // Redirect to booking page instead of homepage
        window.location.href = "index.html"; 
    } catch (error) {
        console.error("Login Error: ", error.message);
        if (error.message.includes("Invalid login credentials")) {
            showMessage("Invalid Email or Password", "signInMessage");
        } else {
            showMessage("Unable to login: " + error.message, "signInMessage");
        }
    }
});

// Forgot Password
const forgotPasswordButton = document.getElementById('submitForgotPassword');
forgotPasswordButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("Forgot Password clicked");

    const email = document.getElementById('forgot-password-email').value;

    try {
        const { error } = await forgotPassword(email);

        if (error) {
            console.error("Forgot Password Error:", error.message);
            showMessage("Unable to send password reset email: " + error.message, "forgotPasswordMessage");
            return;
        }

        showMessage("Password reset email sent successfully", "forgotPasswordMessage");
    } catch (error) {
        console.error("Error during forgot password:", error.message);
        showMessage("Unable to send password reset email: " + error.message, "forgotPasswordMessage");
    }
});


