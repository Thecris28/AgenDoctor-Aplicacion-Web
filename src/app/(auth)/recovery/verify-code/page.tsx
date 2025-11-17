import { Suspense } from 'react'
import VerifyCodeContent from './VerifyCodeContent'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AgenDoctor</h2>
          <p className="text-gray-600">Cargando verificación de código...</p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyCodeContent />
    </Suspense>
  )
}