import React from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Profesional } from '@/interfaces/agendamiento';

interface Props {
  profesional: Profesional;
  fecha: Date;
  hora: string;
  paciente: {
    nombre: string;
    email: string;
    telefono: string;
    rut: string;
  };
  onNewAppointment: () => void;
}

const AppointmentSummary: React.FC<Props> = ({ 
  profesional, 
  fecha, 
  hora, 
  paciente, 
  onNewAppointment 
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        ¡Cita Confirmada!
      </h3>
      <p className="text-gray-600 mb-8">
        Su cita médica ha sido agendada exitosamente
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{profesional.nombre}</p>
              <p className="text-sm text-gray-600">{profesional.titulo}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{formatDate(fecha)}</p>
              <p className="text-sm text-gray-600">Fecha de la consulta</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{hora}</p>
              <p className="text-sm text-gray-600">Hora de la consulta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-8">
        <h4 className="font-semibold text-blue-900 mb-2">Información del Paciente</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Nombre:</strong> {paciente.nombre}</p>
          <p><strong>Email:</strong> {paciente.email}</p>
          <p><strong>Teléfono:</strong> {paciente.telefono}</p>
          <p><strong>RUT:</strong> {paciente.rut}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Recibirá una confirmación por email con todos los detalles de su cita.
        </p>
        
        <button
          onClick={onNewAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Agendar Nueva Cita
        </button>
      </div>
    </div>
  );
};

export default AppointmentSummary;