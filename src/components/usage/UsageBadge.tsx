"use client"

import { useAuth } from '@/hooks/useAuth'
import { useUsage } from '@/hooks/useUsage'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function UsageBadge() {
    const { user, plan } = useAuth()
    const { count, limit, isAtLimit, loading } = useUsage(user?.id, plan)

    if (loading || !user) return null

    const percentage = limit === Infinity ? 0 : (count / limit) * 100
    const displayLimit = limit === Infinity ? '∞' : limit

    return (
        <div className="flex flex-col gap-1 w-32 sm:w-40">
            <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>{count} / {displayLimit} today</span>
                {plan !== 'platinum' && <span>{Math.round(percentage)}%</span>}
            </div>
            {plan !== 'platinum' && (
                <Progress
                    value={percentage}
                    className={cn(
                        "h-1.5",
                        isAtLimit ? "[&>div]:bg-red-500" : "[&>div]:bg-primary"
                    )}
                />
            )}
        </div>
    )
}
