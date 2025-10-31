'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { profiles } from '@/db/schema';

import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db';


export async function loginAction(email: string, password: string, next: string) {
    const supabase = await createClient()

    // TODO: type-casting here, validate your inputs
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect(next)
}

export async function signupAction(email: string, password: string, next: string) {
    const supabase = await createClient()

    // TODO: type-casting here, validate your inputs
    const { data: response, error } = await supabase.auth.signUp({
        email,
        password,
    })

    console.log('Signup response:', response);
    console.log('Signup error:', error);
    if (error) {
        return { error: error.message }
    }

    const user = response.user
    if (!user) {
        return { error: 'Failed to create user. Please try again.' }
    }
    // Insert profile via Drizzle
    if (user.id) {
        await db.insert(profiles).values({
            id: user.id,
            email: user.email!,
            role: 'user',
            full_name: '',
        });
    }

    // check if the session exists:
    const session = response.session

    revalidatePath('/', 'layout')
    if (session) redirect(next);        // already authenticated
    else redirect('/verify-email');
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}