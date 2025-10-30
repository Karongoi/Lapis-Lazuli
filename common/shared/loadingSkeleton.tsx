export default function LoadingSkeleton() {
    return (
        <div className="flex items-center justify-center m-auto">
            <div className="flex space-x-1">
                {' '}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-8 w-2 bg-primary animate-pulse"
                        style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s',
                            borderRadius: '0.25rem'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}
