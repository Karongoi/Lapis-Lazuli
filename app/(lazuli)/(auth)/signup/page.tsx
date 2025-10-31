'use client'

import { useSearchParams } from 'next/navigation'
import GrainOverlay from '@/common/shared/grainOverly';
import { MailCheckIcon } from '@/components/ui/mail-check';
import { signupAction } from '../actions';
import Image from 'next/image';
import bgImage from '@/public/images/background.png'
import toast from 'react-hot-toast';
import { useTransition } from 'react';

export default function SignupPage() {
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/'
    const [isPending, startTransition] = useTransition()

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
            const result = await signupAction(email, password, next)
            if (result?.error) toast.error(result.error)
            else toast.success('Welcome back!')
        })
    }
    return (
        <div className="relative flex items-center justify-center min-h-screen w-screen overflow-hidden">
            {/* Background image */}
            <Image
                src={bgImage}
                alt="Background"
                fill
                priority
                className="object-cover opacity-70"
            />

            {/* Grain overlay (above image) */}
            <GrainOverlay />

            {/* Form container */}
            <div className=" relative z-20  bg-background w-full max-w-sm md:max-w-lg p-8 md:px-12 py-12 flex flex-col gap-2 rounded-none md:absolute md:right-0 md:top-0 md:h-full md:justify-center"
            >
                <h1 className="text-md md:text-xl font-bold text-center">Welcome to <span className=''>Lapis Lazuli</span></h1>
                <p className='text-center'>Create your account</p>
                <form onSubmit={handleSubmit} className="flex flex-col text-sm gap-5 mt-8">
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
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary hover:bg-secondary text-background transition-all pointer px-4 py-2 mt-2 rounded flex gap-2 justify-center items-center">
                        {isPending ? 'Signing up...' : <><MailCheckIcon /> Sign up with Email</>}
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
                    Already have an account?{' '}
                    <a href="/login" className="hover:text-secondary text-primary hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
}