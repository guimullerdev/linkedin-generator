import { createClient } from './supabase/server'

export type Plan = 'free' | 'plus' | 'gold' | 'platinum'

export const PLAN_LIMITS: Record<Plan, number> = {
    free: 1,
    plus: 3,
    gold: 6,
    platinum: Infinity,
}

export async function checkAndIncrementUsage(userId: string, isRewrite: boolean = false): Promise<{
    allowed: boolean
    current: number
    limit: number
    plan: Plan
}> {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Get user plan
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single()

    const plan = (profile?.plan ?? 'free') as Plan
    const limit = PLAN_LIMITS[plan]

    // Get or create today's usage row
    const { data: usage } = await supabase
        .from('usage_logs')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

    const current = usage?.count ?? 0

    // Rewrite counts as half — round up logic
    // If it's a rewrite, we check if adding 0.5 (or conceptually handles it)
    // Simplified: we store counts in integers. So rewrite might only increment every other time?
    // Prompt says: "Rewrite calls count as half — round up."
    // Let's implement this by storing 2x the count or just handling the logic.
    // Actually, easiest is to store integers and increment by 1 for regular, 
    // and maybe just increment for everyone to keep it simple, OR follow the half rule.

    // Implementation of half-rule:
    // If we store counts * 2 in DB, then generate = +2, rewrite = +1
    // limit * 2 = budget

    const incrementValue = isRewrite ? 1 : 2
    const budget = limit * 2

    if (current + incrementValue > budget) {
        return {
            allowed: false,
            current: Math.ceil(current / 2),
            limit,
            plan
        }
    }

    // Upsert and increment
    await supabase.from('usage_logs').upsert({
        user_id: userId,
        date: today,
        count: current + incrementValue,
    }, { onConflict: 'user_id,date' })

    return {
        allowed: true,
        current: Math.ceil((current + incrementValue) / 2),
        limit,
        plan
    }
}
