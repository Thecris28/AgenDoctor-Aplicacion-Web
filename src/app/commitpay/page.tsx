import { Suspense } from 'react'
import CommitPayContent from './CommitPayContent'
import { Loader } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-blue-100 p-5 mb-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">AgenDoctor</h2>
          <p className="text-gray-600">Cargando procesador de pagos...</p>
        </div>
      </div>
    </div>
  )
}

export default function CommitPayPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CommitPayContent />
    </Suspense>
  )
}