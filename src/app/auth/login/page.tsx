import { LoginButton } from '@/components/auth/LoginButton'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Welcome back
                    </h1>
                    <p className="text-slate-600">
                        Sign in to your account to start generating content.
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <LoginButton provider="github" label="Continue with GitHub" />
                    <LoginButton provider="google" label="Continue with Google" />
                </div>

                <div className="pt-6 text-center text-sm text-slate-500">
                    <p>Your generated posts are stored locally in your browser.</p>
                </div>
            </div>
        </div>
    )
}
