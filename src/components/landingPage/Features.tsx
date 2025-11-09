import { Calendar, Clock, Shield, MessageSquare, Smartphone, Users } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: "Agenda Fácil",
    description: "Reserva tu cita en segundos, sin llamadas ni esperas"
  },
  {
    icon: Clock,
    title: "Disponibilidad 24/7",
    description: "Accede a tu cuenta y gestiona citas en cualquier momento"
  },
  {
    icon: Shield,
    title: "Información Segura",
    description: "Tus datos médicos protegidos con la máxima seguridad"
  },
  {
    icon: MessageSquare,
    title: "Comunicación Directa",
    description: "Chatea directamente con tu psicólogo de confianza"
  },
  {
    icon: Smartphone,
    title: "Multi-dispositivo",
    description: "Úsalo desde tu celular, tablet o computador"
  },
  {
    icon: Users,
    title: "Profesionales Certificados",
    description: "Psicólogos verificados y especializados"
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir AgenDoctor?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simplificamos el acceso a la salud mental con tecnología de vanguardia
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow bg-gray-50">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}