'use client';
import { Suspense } from 'react';
import RegistrationSuccessContent from './RegistrationSuccessContent';

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    }>
      <RegistrationSuccessContent />
    </Suspense>
  );
}