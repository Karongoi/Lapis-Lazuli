'use client';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') ?? 'Something went wrong.';

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <h1 className="text-3xl font-bold mb-4">Oops!</h1>
            <p className="text-lg mb-6">{message ?? `Something went wrong! Sorry.`}</p>
            <a
                href="/verify-email"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
            >
                Verify Email Again
            </a>
        </div>
    );
}
