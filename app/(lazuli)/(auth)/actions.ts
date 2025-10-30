'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const next = (formData.get('next') as string) || '/'

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect(next)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const next = (formData.get('next') as string) || '/'

    const { data: response, error } = await supabase.auth.signUp(data)

    revalidatePath('/', 'layout')

    if (error) {
        redirect('/error')
    }

    // If you have email confirmations enabled, Supabase will NOT sign the user in immediately.
    // So we check if the session exists:
    const session = response.session

    if (session) {
        // User already authenticated — redirect to `next`
        redirect(next)
    } else {
            // Email confirmation required
            redirect('/verify-email') // or show a message
        }
    }

    export async function logout() {
        const supabase = await createClient()
        await supabase.auth.signOut()

        revalidatePath('/', 'layout')
        redirect('/login')
    }