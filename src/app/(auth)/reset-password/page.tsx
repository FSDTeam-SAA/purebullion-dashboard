import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordPage from './_components/ResetPasswordPage';

export const metadata: Metadata = {
    title: 'Reset Password | Pure Bullion',
    description: 'Set a new password for your account',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ResetPasswordPage />
        </Suspense>
    );
}
