'use client';
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import GoogleIcon from '../../../components/ui/GoogleIcon';
import { getLogin } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginCredentials } from '@/interfaces/auth';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    
    const [formLoginData, setFormLoginData] = useState<LoginCredentials>({
      email: '',
      password: '',
    });

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormLoginData({
        ...formLoginData,
        [name]: value
      });
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setLoginError('');
      
      try {
        const data = await getLogin(formLoginData.email, formLoginData.password);
        console.log('Login successful:', data);
        if (data[0].TipoUsuarioId === 1) { // Probando SSH
          console.log('Login successful:', data);
          router.push('/appointment');
        }
        if (data[0].TipoUsuarioId === 2) { 
          console.log('Login successful:', data);
          router.push('/dashboard');
        }
      } catch (error: any) {
        setLoginError(error.message || 'Credenciales incorrectas. Por favor intenta de nuevo.');

      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-600 text-sm">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Google Sign In Button */}
          <button className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 mb-6 group">
            <GoogleIcon />
            <span>Iniciar sesión con Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o continúa con email</span>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl mb-4">
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-4">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium mb-2 text-gray-700 block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formLoginData.email}
                  onChange={handleLoginChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formLoginData.password}
                  onChange={handleLoginChange}
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 focus:outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {isLoading ? 'Procesando...' : 'Iniciar sesión'}
            </button>
            </div>
          </form>

          {/* Switch to register */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes una cuenta?
              <Link
                href="/register/roleSelection"
                className="ml-2 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Al iniciar sesión, aceptas nuestros{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
