import { supabase } from "../config/supabase.js";

// Get current session function with user role
export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        console.error("Error fetching session:", error ? error.message : "No session found");
        return null;
    }

    const session = data.session;

    try {
        const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

        if (userError) {
            console.error("Error fetching user role:", userError.message);
            return session; // Return session even if role fetch fails
        }

        session.user.role = userData.role;
    } catch (err) {
        console.error("Unexpected error:", err);
    }

    return session;
}


// Refresh session function
export async function refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
        console.error("Error refreshing session:", error.message);
        return { error };
    }
    return { message: "Session refreshed successfully", session: data.session };
}

// Handle session state changes function
export function onSessionStateChange(callback) {
    supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

// Check if user is admin function
export async function isAdmin() {
    const session = await getCurrentSession();
    if (session && session.user.role) {
        const roles = (session.user.role || "").split(',').map(r => r.trim()); // Ensure role is a string
        return roles.includes('admin');
    }
    return false;
}