"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, User as UserIcon, Shield, Crown, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function UserMenu() {
    const { user, plan, signOut, loading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    if (loading || !user) return null

    const planIcons = {
        free: <Zap className="w-3 h-3" />,
        plus: <Shield className="w-3 h-3" />,
        gold: <Crown className="w-3 h-3" />,
        platinum: <Crown className="w-3 h-3 text-yellow-500" />,
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 overflow-hidden border border-slate-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                {user.user_metadata.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt={user.email || 'User'}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <UserIcon className="h-5 w-5 text-slate-500" />
                )}
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-20">
                        <div className="px-3 py-3 border-b border-slate-100 flex flex-col gap-1">
                            <p className="text-sm font-semibold truncate text-slate-900">
                                {user.user_metadata.full_name || user.email}
                            </p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize flex items-center gap-1.5 py-0.5 text-[10px]">
                                    {planIcons[plan]}
                                    {plan}
                                </Badge>
                            </div>
                        </div>

                        <div className="py-1">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
                                onClick={signOut}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
