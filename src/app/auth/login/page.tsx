import GoogleLoginForm from '@/components/custom/GoogleLoginForm'
import React from 'react'

const LoginPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Sign in to your account</h1>
                </div>
                <GoogleLoginForm />
            </div>
        </div>
    )
}

export default LoginPage