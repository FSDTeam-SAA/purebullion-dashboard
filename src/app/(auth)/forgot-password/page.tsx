import type { Metadata } from 'next';
import { Suspense } from 'react';
import ForgotPasswordPage from './_components/ForgotPasswordPage';

export const metadata: Metadata = {
    title: 'Forgot Password | Pure Bullion',
    description: 'Request a password reset link or code',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ForgotPasswordPage />
        </Suspense>
    );
}
