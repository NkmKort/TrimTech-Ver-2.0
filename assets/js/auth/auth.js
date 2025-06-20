import { supabase } from "../config/supabase.js";

// Sign up function
export async function signUp(email, password, name, phone) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: name,
                phone,
            }
        }
    });

    if (error) {
        console.error("Sign-up failed:", error.message);
        return null;
    }

    return data?.user || null;
}

// Login function
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.warn("Login failed:", error.message); // Use warn for expected errors (e.g., wrong password)
        return null;
    }

    return data?.user || null;
}

// Logout function
export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout failed:", error.message);
        return false;
    }

    return true;
}

// Get current user function
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Failed to fetch user:", error.message);
        return null;
    }

    return data?.user || null;
}

// Forgot password function
export async function forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
        console.warn("Password reset failed:", error.message);
        return false;
    }

    return true;
}
