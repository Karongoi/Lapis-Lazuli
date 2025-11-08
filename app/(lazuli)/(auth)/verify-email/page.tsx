'use client'
import GrainOverlay from '@/common/shared/grainOverly'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
    const [resent, setResent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function resendEmail() {
        setLoading(true)
        setError(null)

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user?.email) {
            setError('Could not find your email. Please log in again.')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email,
        })

        if (error) {
            setError(error.message)
        } else {
            setResent(true)
        }

        setLoading(false)
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user && user.email_confirmed_at) {
                window.location.href = '/'
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [supabase])

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/images/background.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: '.6',
                }}
            />
            <GrainOverlay />

            <div className='relative z-20 bg-background w-full max-w-sm p-8 md:px-12 py-12 flex flex-col items-center gap-2 shadow-lg'>
                <h1 className="text-2xl font-semibold mb-4">Verify your email</h1>
                <p className="text-muted-foreground mb-6">
                    We&apos;ve sent a verification link to your email address. Please check your inbox
                    and click the link to activate your account.
                </p>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {resent && (
                    <p className="text-green-500 mb-4">Verification email resent successfully.</p>
                )}

                <button
                    onClick={resendEmail}
                    disabled={loading || resent}
                    className="bg-primary text-background hover:bg-secondary transition-all pointer px-4 py-2 rounded w-full mb-3 disabled:opacity-50"
                >
                    {loading ? 'Resending...' : resent ? 'Email Sent' : 'Resend Email'}
                </button>

                <a
                    href="/login"
                    className="text-primary hover:text-secondary hover:underline text-sm"
                >
                    Back to Login
                </a>
            </div>
        </div>
    )
}
