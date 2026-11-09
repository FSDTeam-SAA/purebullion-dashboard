import type { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyOtpPage from '../verify-otp/_components/VerifyOtpPage';

export const metadata: Metadata = {
    title: 'Verify Your Email | Pure Bullion',
    description: 'Enter the 6-digit verification code sent to your email',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <VerifyOtpPage />
        </Suspense>
    );
}
