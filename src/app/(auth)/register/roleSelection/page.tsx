// src/app/register/page.tsx
'use client';
import Link from 'next/link';
import { User, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterRoleSelection() {
  const router = useRouter();

  const handleRoleSelection = (role: 'patient' | 'psychologist') => {

    if(role === 'patient')
      router.push(`/register/patient`);
    else
      router.push(`/register/identifyPsychologist`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crear una cuenta
            </h1>
            <p className="text-gray-600 text-sm">
              Selecciona el tipo de cuenta que deseas crear
            </p>
          </div>

          <div className="space-y-4">
            {/* Paciente Option */}
            <button
              onClick={() => handleRoleSelection('patient')}
              className="w-full bg-white hover:border-blue-300 hover:shadow-md border border-gray-200 text-gray-800 font-medium py-4 px-4 rounded-xl transition-all duration-200 flex items-center"
            >
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Soy un paciente</h3>
                <p className="text-sm text-gray-600">
                  Busco ayuda psicológica y quiero agendar citas
                </p>
              </div>
            </button>

            {/* Psicólogo Option */}
            <button
              onClick={() => handleRoleSelection('psychologist')}
              className="w-full bg-white hover:border-green-300 hover:shadow-md border border-gray-200 text-gray-800 font-medium py-4 px-4 rounded-xl transition-all duration-200 flex items-center"
            >
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Soy un psicólogo</h3>
                <p className="text-sm text-gray-600">
                  Ofrezco servicios profesionales de psicología
                </p>
              </div>
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes una cuenta?
              <Link
                href="/login"
                className="ml-2 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}