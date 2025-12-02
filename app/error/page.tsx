'use client';
export default function ErrorPage() {

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg text-muted-foreground mb-6">
                An unexpected error has occurred. Please try again later.
            </p>
            <a href="/" className="text-white bg-primary hover:bg-secondary px-4 py-2 rounded-sm">
                Go back to Home
            </a>
        </div>
    );
}
