"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User, type Session } from '@supabase/supabase-js'
import { type Plan } from '@/lib/usage'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [plan, setPlan] = useState<Plan>('free')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
                await fetchProfile(session.user.id)
            }

            setLoading(false)
        }

        const fetchProfile = async (userId: string) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .single()

            if (!error && data) {
                setPlan(data.plan as Plan)
            }
        }

        getInitialSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                if (session?.user) {
                    fetchProfile(session.user.id)
                } else {
                    setPlan('free')
                }
                setLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/auth/login'
    }

    return { user, session, plan, loading, signOut }
}
