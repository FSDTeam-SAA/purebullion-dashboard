import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginPage from './_components/LoginPage';

export const metadata: Metadata = {
    title: 'Login | Pure Bullion',
    description: 'Sign in to access your Pure Bullion account.',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LoginPage />
        </Suspense>
    );
}
