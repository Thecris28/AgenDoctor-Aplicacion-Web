// src/app/(auth)/register/identifyPsychologist/page.tsx
'use client';
import { verifyPsychologistRut } from '@/services/authService';
import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle , Info } from 'lucide-react';
import { useProfesionalStore } from '@/store/profesional.store';
import { Profesional } from '@/interfaces/auth';
import { useRouter } from 'next/navigation';

export default function IdentifyPsychologist() {
  const [rut, setRut] = useState('');
  const { setProfesional } = useProfesionalStore()
  const [VerifyInfo, setVerifyInfo] = useState<Profesional>();
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const router = useRouter();
  // Función para formatear RUT mientras el usuario escribe
  const formatRut = (value: string) => {
    let rutClean = value.replace(/[^0-9kK]/g, '');
    
    if (rutClean.length > 9) {
      rutClean = rutClean.substring(0, 9);
    }
    
    if (rutClean === '') {
      return '';
    }
    
    let result;
    if (rutClean.length > 1) {
      const digitoVerificador = rutClean.charAt(rutClean.length - 1);
      const rutSinDigito = rutClean.substring(0, rutClean.length - 1);
      result = rutSinDigito.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      result = result + '-' + digitoVerificador;
    } else {
      result = rutClean;
    }
    
    return result;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
    // Resetear estados cuando cambia el input
    setVerificationStatus('idle');
    setMessage('');
    setIsValid(true);
  };

  // Manejar envío del formulario con mejor control de estados
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rut) {
      setIsValid(false);
      setMessage('Por favor ingresa tu RUT');
      return;
    }
    
    setIsLoading(true);
    setVerificationStatus('loading');
    setMessage('Verificando RUT...');
    
    try {
      const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
      console.log('RUT a verificar:', cleanRut);
      
      // Llamada a la API
      const rutVerify = await verifyPsychologistRut(cleanRut);
      console.log('Resultado de verificación:', rutVerify);
      if (rutVerify && rutVerify.isValid) {
        setIsValid(true);
        setVerificationStatus('success');
        setMessage('RUT verificado con éxito');
        setVerifyInfo(rutVerify.professional);
      } else {
        setIsValid(false);
        setVerificationStatus('error');
        setMessage(rutVerify?.error || 'RUT no encontrado en el registro de profesionales de salud');
      }
    } catch (error) {
      console.error('Error al verificar RUT:', error);
      setIsValid(false);
      setVerificationStatus('error');
      setMessage('Error al conectar con el servicio de verificación. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Guardar datos del profesional en el store
    if (VerifyInfo) {
      router.push('/register/psychologist');
      setProfesional(VerifyInfo);
    }
  }

  return (
    <section className="bg-white flex flex-col items-center justify-center p-4 mt-30">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portal psicólogo
            </h1>
            <p className="text-gray-600 text-sm mb-1">
              Ingresa tu RUT para crear una cuenta.
            </p>
            
          </div>
          <div className='flex space-x-4 bg-blue-100 p-3 items-center rounded-lg mb-6 border-1 border-blue-500'>
            <Info className="h-7 w-7 text-blue-500" />
            <p className="text-blue-500 text-xs lg:text-sm font-medium">
              Se verificará tu inscripción en el sistema de prestadores de salud en Chile.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2 relative">
                <label htmlFor="rut" className="text-sm font-medium text-gray-700 block">
                  RUT
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="rut"
                    value={rut}
                    onChange={handleRutChange}
                    placeholder="Ej: 12.345.678-9"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 border ${
                      !isValid ? 'border-red-300' : 
                      verificationStatus === 'success' ? 'border-green-300' :
                      'border-gray-200'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50`}
                  />
                  {/* Mensaje de estado */}
                {message && (
                  <div className='absolute top-12'>
                  <div className={`flex items-center gap-2 text-sm mt-2 ${
                    verificationStatus === 'success' ? 'text-green-600' :
                    verificationStatus === 'error' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {verificationStatus === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                    {verificationStatus === 'success' && <CheckCircle className="h-4 w-4" />}
                    {verificationStatus === 'error' && <XCircle className="h-4 w-4" />}
                    <span>{message}</span>
                  </div>
                  </div>
                )}
                </div>
                
                
              </div>

              <button
                type="submit"
                disabled={isLoading || !rut || verificationStatus === 'success' || rut.length < 11}
                className="w-full bg-blue-600 mt-9 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                
                  Verificar
          
              </button>

              {/* Botón de continuar cuando la verificación es exitosa */}
              {verificationStatus === 'success' && (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Continuar con el registro
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <a 
              href="/register/roleSelection" 
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              ← Volver a selección de tipo de cuenta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}