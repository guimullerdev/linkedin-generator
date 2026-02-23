"use client"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Github, Mail } from 'lucide-react'

interface LoginButtonProps {
    provider: 'github' | 'google'
    label: string
}

export function LoginButton({ provider, label }: LoginButtonProps) {
    const supabase = createClient()

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Error logging in:', error.message)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-6 text-lg"
        >
            {provider === 'github' ? <Github className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            {label}
        </Button>
    )
}
