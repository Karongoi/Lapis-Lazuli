'use client'

import { useSearchParams } from 'next/navigation'
import GrainOverlay from '@/common/shared/grainOverly';
import { MailCheckIcon } from '@/components/ui/mail-check';
import { login } from '../actions';

export default function LoginPage() {
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/'

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

            {/* Glass effect */}
            {/* <div className='relative w-full max-w-md rounded-xl bg-purple-300 dark:bg-gray-500/10 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 p-8 md:px-12 py-20 flex flex-col'> */}
            <div className='relative z-20 bg-background w-full max-w-sm p-8 md:px-12 py-12 flex flex-col gap-2'>
                <h1 className="text-md md:text-xl font-bold text-center">Welcome to <span className=''>Lapis Lazuli</span></h1>
                <p className='text-center'>Sign in to your account</p>
                <form action={login} className="flex flex-col text-sm gap-5 mt-8">
                    <input type="hidden" name="next" value={next} />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="px-4 py-2 rounded-sm bg-primary-foreground border border-secondary-foreground/10"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className="px-4 py-2 rounded-sm bg-primary-foreground border border-secondary-foreground/10"
                    />
                    <button type="submit" className="bg-primary hover:bg-secondary text-background transition-all pointer px-4 py-2 mt-2 rounded flex gap-2 justify-center items-center">
                        <MailCheckIcon />
                        Sign in with Email
                    </button>
                </form>

                <p className='text-center'>or</p>
                {/* <button
                    onClick={signInWithGoogle}
                    className="bg-foreground text-background px-4 py-2 rounded-md flex items-center justify-center gap-2"
                >
                    <img
                        src={googleIcon}
                        fetchPriority="high"
                        alt="Google Icon"
                        className="w-4 h-4"
                    />
                    Continue with Google
                </button> */}
                <p className='text-center text-sm mt-0.5'>
                    Create account?{' '}
                    <a href="/signup" className="hover:text-secondary text-primary hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}