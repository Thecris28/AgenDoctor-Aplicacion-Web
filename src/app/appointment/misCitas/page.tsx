'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getPatientAppointments } from '@/services/patientService';
import { useAuthStore } from '@/store/auth.store';
import { usePatientStore } from '@/store/patient.store';
import { PatientAppointment } from '@/interfaces/patient';

interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  profesional: {
    nombre: string;
    especialidad: string;
    imagen?: string;
  };
  estado: 'Programada' | 'Completada' | 'Cancelada' | 'No Asistió';
  modalidad: 'Presencial' | 'Virtual';
  direccion?: string;
  linkVirtual?: string;
  notas?: string;
  precio: number;
}

export default function MisCitasPage() {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'completadas'>('pendientes');
  const [citas, setCitas] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const { patient } = usePatientStore();
  
  useEffect(() => {
    setLoading(true);
    const fetchCitas = async () => {

     if (!patient) return;
      try {
        
        const appointments = await getPatientAppointments(patient?.idPaciente || 0);
        setCitas(appointments);
      } catch (error) {
        console.error('Error loading citas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, [patient]);

  // Filtrar citas según el tab activo
  const citasPendientes = citas.filter(cita => 
    cita.estado_cita === 'Programada'
  );
  
  const citasCompletadas = citas.filter(cita => 
    cita.estado_cita === 'Completada' || cita.estado_cita === 'Cancelada' || cita.estado_cita === 'No Asistió'
  );

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Programada': return 'bg-blue-100 text-blue-800';
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'No Asistió': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'Programada': return <Clock size={16} />;
      case 'Completada': return <CheckCircle size={16} />;
      case 'Cancelada': return <XCircle size={16} />;
      case 'No Asistió': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatFecha = (fecha: string) => {
    const [dia, mes, año] = fecha.split('-');
    const date = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
  
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const CitaCard = ({ cita }: { cita: PatientAppointment }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start space-y-3 mb-4 flex-col md:flex-row">
        <div className="flex items-center space-x-3 ">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {cita.Diagnostico ? (
              <img
                src={cita.Diagnostico}
                alt={`${cita.Diagnostico} ${cita.Diagnostico}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {cita.nombre_psicologo.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
               {cita.nombre_psicologo}
            </h3>
            <p className="text-sm text-blue-500 font-medium">{cita.especialidad}</p>
          </div>
        </div>
        
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(cita.estado_cita)}`}>
          {getStatusIcon(cita.estado_cita)}
          {cita.estado_cita}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>{formatFecha(cita.fecha)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-2" />
          <span>{cita.hora} hrs</span>
        </div>

        <div className="flex items-center text-gray-600">
          {cita.Tratamiento === 'Presencial' ? (
            <>
              <MapPin size={16} className="mr-2" />
              <span>{cita.Tratamiento}</span>
            </>
          ) : (
            <>
              <User size={16} className="mr-2" />
              <span>Sesión Virtual</span>
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-lg font-semibold text-gray-900">
            ${Number(cita.monto).toLocaleString('es-CL')}
          </span>
          
          <div className="flex gap-2">
            {cita.estado_cita === 'Programada' && (
              <>
                {/* {cita. === 'Virtual' && cita.linkVirtual && (
                  <a
                    href={cita.linkVirtual}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Unirse
                  </a>
                )} */}
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Reagendar
                </button>
              </>
            )}
            
            {cita.estado_cita === 'Completada' && (
              <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                Ver detalles
              </button>
            )}
          </div>
        </div>

        {cita.Diagnostico && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Notas:</strong> {cita.Diagnostico}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto min-h-svh">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Citas</h1>
        <p className="text-gray-600">Administra tus citas programadas y revisa tu historial.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pendientes')}
              className={`flex py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pendientes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Próximas Citas 
              <p className={`rounded-xl ml-2 px-3 flex py-0.5 items-center justify-center text-xs font-semibold
                ${activeTab === 'pendientes' ? 'text-blue-700 bg-blue-100' : 'bg-gray-300 text-gray-700'}`}>
                {citasPendientes.length}
                </p>
            </button>
            <button
              onClick={() => setActiveTab('completadas')}
              className={`flex py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completadas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historial
              <p className={`rounded-xl ml-2 px-3 flex py-0.5 items-center justify-center text-xs font-semibold
                ${activeTab === 'completadas' ? 'text-blue-700 bg-blue-100' : 'bg-gray-300 text-gray-700'}`}>
                {citasCompletadas.length}
                </p>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'pendientes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {citasPendientes.length > 0 ? (
                citasPendientes.map(cita => (
                  <CitaCard key={cita.IdCita} cita={cita} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes citas programadas</h3>
                  <p className="text-gray-600 mb-4">Agenda tu primera cita con uno de nuestros profesionales</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Agendar Cita
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completadas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {citasCompletadas.length > 0 ? (
                citasCompletadas.map(cita => (
                  <CitaCard key={cita.IdCita} cita={cita} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes citas en tu historial</h3>
                  <p className="text-gray-600">Las citas completadas aparecerán aquí</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
