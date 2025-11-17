
'use client'
import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sendEmailRecovery, sendToken } from '@/services/authService'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setError('')
  setSuccess(false)

  try {
    const Token = Math.floor(100000 + Math.random() * 900000).toString();
    await sendToken(email, Token)
    console.log('Generated Token:', Token);
    console.log('Email for recovery:', email);

     const response = await sendEmailRecovery(email, Token)
        console.log('Generated Token2:', Token);
    if (response && response.error) {
      throw new Error(response.error || 'Error al enviar el correo de recuperación')
    }
    console.log('Response from sendEmailRecovery:', response);

    setTimeout(async () => {

    
      setIsSubmitting(false)
      setSuccess(true)

      router.push(`/recovery/verify-code?email=${encodeURIComponent(email)}`)
    }, 2000)
  } catch (error) {
    if (error instanceof Error)
    setError('No se pudo enviar el correo de recuperación. Intenta nuevamente.')
    setIsSubmitting(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-600 text-sm">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center mb-4">
            ¡Listo! Si el correo existe, recibirás un enlace para restablecer tu contraseña.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 outline-2 outline-gray-200 -outline-offset-2 rounded-xl focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="tu@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
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
