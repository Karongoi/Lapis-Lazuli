'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import GrainOverlay from '@/common/shared/grainOverly';
import { MailCheckIcon } from '@/components/ui/mail-check';
import { loginAction } from '../actions';
import Image from 'next/image';
import bgImage from '@/public/images/background.png'
import toast from 'react-hot-toast';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/'
    const [isPending, startTransition] = useTransition()
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            toast.error('Please fill in both fields')
            return
        }

        startTransition(async () => {
            const result = await loginAction(email, password, next)
            if (result?.error) {
                if (result.error.includes('Email not confirmed')) {
                    toast.error('Please verify your email before logging in.')
                    router.push('/verify-email');
                    return
                }
                toast.error(result.error)
            }
            else toast.success('Welcome back!')
        })
    }

    return (
        <div className="relative flex items-center min-h-screen w-screen overflow-hidden">
            {/* Background image */}
            <Image
                src={bgImage}
                alt="Background"
                priority
                className="hidden sm:block object-cover h-screen w-full opacity-70"
            />
            <span className='absolute left-6 bottom-6 italic'>Lapis Lazuli Threads &copy;2025</span>

            {/* Grain overlay (above image) */}
            <GrainOverlay />

            {/* Form container */}
            <div
                className="relative z-20 bg-background w-full lg:w-[45%] p-8 md:px-12 py-12 flex flex-col items-center gap-2 h-screen justify-center"
            >
                <h1 className="text-md md:text-xl lg:text-2xl font-bold text-center">Welcome to <span className=''>Lapis Lazuli</span></h1>
                <p className='text-center'>Sign in to your account</p>
                <form onSubmit={handleSubmit} className="flex flex-col text-sm w-full max-w-sm mx-auto gap-5 mt-8">
                    <Input type="hidden" name="next" value={next} />

                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="px-4 py-2 rounded-sm bg-primary-foreground border border-secondary-foreground/10"
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className="px-4 py-2 rounded-sm bg-primary-foreground border border-secondary-foreground/10"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary hover:bg-secondary text-background transition-all pointer px-4 py-2 mt-2 rounded flex gap-2 justify-center items-center">
                        {isPending ? 'Signing in...' : <><MailCheckIcon /> Sign in with Email</>}
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