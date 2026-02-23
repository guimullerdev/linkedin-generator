"use client"

import Link from 'next/link'
import { UsageBadge } from '@/components/usage/UsageBadge'
import { UserMenu } from '@/components/auth/UserMenu'
import { Linkedin } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
                            <Linkedin className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                            LinkedIn <span className="text-primary">Generator</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <UsageBadge />
                    <UserMenu />
                </div>
            </div>
        </header>
    )
}
