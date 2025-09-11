'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Mail, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');


  
  const getRoleText = () => {
    switch (role) {
      case 'psychologist':
        return {
          title: 'Registro de Psicólogo Exitoso',
          subtitle: 'Tu cuenta de psicólogo ha sido creada correctamente',
          description: 'Ya puedes comenzar a ofrecer tus servicios profesionales a través de nuestra plataforma.',
          icon: `<UserCheck className="w-16 h-16 text-green-500" />`
        };
      case 'patient':
        return {
          title: 'Registro de Paciente Exitoso',
          subtitle: 'Tu cuenta de paciente ha sido creada correctamente',
          description: 'Ya puedes buscar y agendar citas con psicólogos profesionales.',
          icon: <UserCheck className="w-16 h-16 text-green-500" />
        };
      default:
        return {
          title: 'Registro Exitoso',
          subtitle: 'Tu cuenta ha sido creada correctamente',
          description: 'Ya puedes acceder a nuestra plataforma.',
          icon: <UserCheck className="w-16 h-16 text-green-500" />
        };
    }
  };

  const roleInfo = getRoleText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500" />
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Registro Exitoso!
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg font-semibold text-green-600 mb-4">
            {roleInfo.subtitle}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {roleInfo.description}
          </p>

          {/* Email Verification Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                Verifica tu correo electrónico
              </span>
            </div>
            <p className="text-sm text-blue-600">
              Hemos enviado un enlace de verificación a tu correo. 
              Por favor, revisa tu bandeja de entrada y spam.
            </p>
          </div>

          {/* Next Steps */}
          {role === 'psychologist' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-green-800 mb-2">
                Próximos pasos:
              </h3>
              <ul className="text-sm text-green-700 text-left space-y-1">
                <li>• Completa tu perfil profesional</li>
                <li>• Configura tu disponibilidad</li>
                <li>• Comienza a recibir pacientes</li>
              </ul>
            </div>
          )}

          {role === 'patient' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Próximos pasos:
              </h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Explora psicólogos disponibles</li>
                <li>• Lee perfiles y especialidades</li>
                <li>• Agenda tu primera consulta</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Iniciar Sesión
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/"
              className="w-full bg-transparent hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            ¿Necesitas ayuda?
          </p>
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}