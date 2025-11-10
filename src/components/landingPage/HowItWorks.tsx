import { Search, Calendar, Heart, User2 } from 'lucide-react';

const steps = [
  {
    icon: User2,
    step: "01",
    title: "Crea tu cuenta",
    description: "Regístrate rápidamente con tu correo electrónico."
  },
  {
    icon: Search,
    step: "02", 
    title: "Busca un Psicólogo",
    description: "Busca entre nuestros profesionales certificados por especialidad"
  },
  {
    icon: Calendar,
    step: "03",
    title: "Reserva tu cita",
    description: "Selecciona fecha y hora."
  },
  {
    icon: Heart,
    step: "04",
    title: "Asiste a tu sesión",
    description: "Conéctate desde cualquier dispositivo o en persona."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como agendar tu primera cita?
          </h2>
          <p className="text-xl text-gray-600">
            Acceder a la salud mental nunca ha sido tan fácil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <step.icon className="w-10 h-10 text-white" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {/* Línea conectora (excepto en el último) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-blue-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}