'use client'
import { useState } from 'react'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { changePassword } from '@/services/authService'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setIsSubmitting(false)
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      setIsSubmitting(false)
      return
    }

    try {
      const data = await changePassword(email, password);
      console.log('Password changed for:', email);
      console.log('New password:', password);
      console.log('Response from changePassword:', data);
      setTimeout(() => {
        setSuccess(true)
        setIsSubmitting(false)
      }, 1200)
    } catch (err) {
      setError('No se pudo cambiar la contraseña. Intenta nuevamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restablecer Contraseña</h1>
          {success ? (
            <p className="text-gray-600 text-sm">
            
          </p>
          ) : (
            <p className="text-gray-600 text-sm">
            Ingresa tu nueva contraseña para tu cuenta.
          </p>
          )}

        </div>

        {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-green-700 mb-2">¡Contraseña cambiada exitosamente!</h2>
              <p className="text-gray-600 mb-6 text-center">
                Ahora puedes iniciar sesión con tu nueva contraseña.
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Iniciar sesión
              </Link>
            </div>
          
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                {isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}