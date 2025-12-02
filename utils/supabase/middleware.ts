import { db } from '@/lib/db'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { profiles } from '@/db/schema'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and supabase.auth.getUser().
    // A simple mistake could make it very hard to debug issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // --- Routes that require authentication ---
    const protectedRoutes = ['/checkout', '/account', '/orders', '/settings', '/profile', '/admin']
    const authRoutes = ['/login', '/signup', '/verify-email']

    const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

    // --- Redirect authenticated users away from auth pages ---
    if (authRoutes.some(route => pathname.startsWith(route)) && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // --- Redirect unauthenticated users trying to access protected pages ---
    if (isProtected && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('next', pathname) // remember original destination
        return NextResponse.redirect(url)
    }

    if (user) {
        const userId = user.id
        console.log('Middleware authenticated user:', { userId, pathname })
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

        // const profile = await db.query.profiles.findFirst({
        //     where: eq(profiles.id, user.id),
        // })

        const role = profile?.role?.toLowerCase().trim()

        // 🔍 Debug info (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.log('Middleware role check:', { profile, userId, role, pathname })
        }

        // Restrict access to /admin if not admin
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}