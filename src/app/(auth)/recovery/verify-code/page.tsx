'use client'
import { useState, useRef } from 'react'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyOtp } from '@/services/authService'

export default function VerifyCodePage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || '';


  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Solo números
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setError('')
  setSuccess(false)
  const code = otp.join('')
  if (code.length !== 6) {
    setError('Debes ingresar los 6 dígitos.')
    setIsSubmitting(false)
    return
  }
  try {
    const response = await verifyOtp(email, code)
    console.log('OTP verificado para:', email);
    console.log('Código ingresado:', code);

    if (response.message === 'Token válido') {
      setSuccess(true)
    } else {
      throw new Error('El código es incorrecto o expiró.')
    }
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirigir a la página de cambio de contraseña con el email
      router.push(`/recovery/reset-password?email=${encodeURIComponent(email)}`)
    }, 1200)
  } catch (err) {
    setError('El código es incorrecto o expiró.')
    setIsSubmitting(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifica tu código</h1>
          <p className="text-gray-600 text-sm">
            Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-green-700 font-semibold">¡Código verificado correctamente!</p>
            <Link
              href="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center"
            >
              Ir al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputsRef.current[idx] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  disabled={isSubmitting}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              {isSubmitting ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}