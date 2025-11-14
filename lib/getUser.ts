import { createClient } from "@/utils/supabase/server";

export async function getUser() {
    const supabase = await createClient()
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Return only what you need to avoid leaking extra info
    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "",
        role: user.user_metadata?.role || "customer", // default role
        avatar: user.user_metadata?.avatar_url || null,
    };
}
