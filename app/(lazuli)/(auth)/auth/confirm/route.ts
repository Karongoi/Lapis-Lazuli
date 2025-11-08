import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

function getFriendlyErrorMessage(errorMessage: string) {
    if (errorMessage.includes('invalid token')) return 'This link is invalid. Please request a new one.';
    if (errorMessage.includes('expired')) return 'Your link has expired. Please request a new one.';
    if (errorMessage.includes('already used')) return 'This link has already been used.';
    return 'Something went wrong. Please try again.'; // fallback
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'


    if (token_hash && type) {
        const supabase = await createClient();

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            redirect(next);
        } else {
            const friendlyMessage = getFriendlyErrorMessage(error.message);
            redirect(`/auth/error?message=${encodeURIComponent(friendlyMessage)}`);
        }
    } else {
        redirect(`/auth/error?message=${encodeURIComponent('Missing token or type')}`);
    }
}