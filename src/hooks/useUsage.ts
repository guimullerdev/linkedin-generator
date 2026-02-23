"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PLAN_LIMITS, type Plan } from '@/lib/usage'

export function useUsage(userId: string | undefined, plan: Plan) {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchUsage = async () => {
        if (!userId) return

        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('usage_logs')
            .select('count')
            .eq('user_id', userId)
            .eq('date', today)
            .single()

        if (!error && data) {
            setCount(Math.ceil(data.count / 2))
        } else {
            setCount(0)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUsage()

        // Poll for updates every 30 seconds or set up a real-time subscription
        const interval = setInterval(fetchUsage, 30000)
        return () => clearInterval(interval)
    }, [userId])

    const limit = PLAN_LIMITS[plan]
    const isAtLimit = count >= limit

    return { count, limit, isAtLimit, loading, refetch: fetchUsage }
}
