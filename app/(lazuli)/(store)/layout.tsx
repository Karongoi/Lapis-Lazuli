import React from 'react'
import AppLayoutClient from './AppLayoutClient'

export default function AppLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <AppLayoutClient>
            {children}
        </AppLayoutClient>
    )
}