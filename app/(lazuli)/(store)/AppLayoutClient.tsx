'use client'

import Loading from "@/app/loading"
import Navbar from "@/common/widgets/Navbar"


export default function AppLayoutClient({
    children
}: {
    children: React.ReactNode
}) {
    // const { isUserLoaded } = useUser()
    // if (!isUserLoaded) return <Loading />

    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="transition-all duration-500 ease-in-out">
                <Navbar />
            </div>
                {children}
        </div>
    )
}
