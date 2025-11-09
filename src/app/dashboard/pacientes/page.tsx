'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getPatientHistory, patientList } from '@/services/psicologoService';
import { useUserData } from '@/hooks/useUserData';
import { PatientData } from '@/interfaces/psychologist';
import { formatFecha } from '@/utils/dateUtils';

export interface Historial {
  idCita:            number;
  FechaCita:         Date;
  HoraCita:          string;
  Duracion:          string;
  estadoCita:        number;
  DescripcionEstado: string;
  Diagnostico:       string;
  Tratamiento:       string;
  observaciones?:    string;
}


// Nuevas interfaces para el historial


interface HistorialPaciente {
  paciente: {
    id: number;
    nombre: string;
    rut: string;
    email: string;
  };
  citas: Historial[];
  totalCitas: number;
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  
  // Nuevos estados para el historial
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(null);
  const [historialPaciente, setHistorialPaciente] = useState<HistorialPaciente | null>(null);
  const [citasHistorial, setCitasHistorial] = useState<Historial[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const { userData, isLoading } = useUserData();

  const fetchPatients = async () => {
    if (!userData) return;

    const data = await patientList(userData.id);
    console.log('Fetched patients:', data);
    setPatients(data);
    setFilteredPatients(data);
    setLoading(false);
  }

const loadHistorialPaciente = async (pacienteId: number, pacienteData: any) => {
  setLoadingHistorial(true);
  try {
    const data: Historial[] = await getPatientHistory(pacienteId);
    setHistorialPaciente({
      paciente: {
        email: pacienteData.correo,
        nombre: pacienteData.nombreCompleto,
        rut: pacienteData.rut,
        id: pacienteId
      },
      citas: data,
      totalCitas: data.length
    });
    setLoadingHistorial(false);
  } catch (error) {
    setLoadingHistorial(false);
  }
};

  useEffect(() => {
    fetchPatients();
  }, [userData]);

  // Filtrar pacientes
  useEffect(() => {
    let filtered = patients;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.rut.includes(searchTerm) ||
        patient.telefono.includes(searchTerm)
      );
    }

    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, patients]);

  const formatoFecha = (fecha: Date) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para formatear fecha del historial
  const formatFechaHistorial = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completada': return 'bg-green-100 text-green-800 border-green-200';
      case 'programada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'en progreso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función actualizada para abrir el modal
 const openModal = (pacienteId: number, pacienteData: any) => {
  setSelectedPacienteId(pacienteId);
  setIsOpen(true);
  loadHistorialPaciente(pacienteId, pacienteData);
};
  

  // Función para cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
    setHistorialPaciente(null);
    setSelectedPacienteId(null);
    setLoadingHistorial(false);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Activo': 'bg-green-100 text-green-800',
      'Inactivo': 'bg-red-100 text-red-800',
    };
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pacientes</h1>
          <p className="text-gray-600">Gestiona y consulta la información de tus pacientes</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Buscador */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, RUT o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-400 placeholder:text-gray-500 text-sm/6"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre del Paciente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">RUT</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Edad</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Última Cita</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-100 animate-pulse">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </td>
                  </tr>
                ))
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.idPaciente} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-medium">
                          {getInitials(patient.nombreCompleto.split(' ').slice(0,1).join(' '))}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {patient.nombreCompleto.split(' ').slice(0,1).join(' ') + ' ' + patient.nombreCompleto.split(' ').slice(2,3).join(' ')}
                          </div>
                          <div className="text-sm text-gray-500">{patient.correo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {patient.rut}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {String(patient.Edad)}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatFecha(String(patient.ultima_cita!).split("T")[0])}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(patient.ultima_cita ? 'Activo' : 'Inactivo')}`}>
                        {patient.ultima_cita ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => openModal(patient.idPaciente, patient)}  
                          className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="text-gray-300" />
                      <p>No se encontraron pacientes</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredPatients.length)} de {filteredPatients.length} pacientes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal historial medico */}
      {isOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex justify-between items-start mb-6'>
                <div>
                  <h2 className='text-2xl font-bold'>Historial Médico</h2>
                  <p className='text-gray-600'>Registro de tratamiento y detalles relevantes</p>
                  {historialPaciente && (
                    <div className="mt-2">
                      <p className='text-gray-900 font-medium capitalize'>{historialPaciente.paciente.nombre}</p>
                      <p className='text-sm/6 text-gray-500'>{historialPaciente.paciente.rut} • {historialPaciente.paciente.email}</p>
                      <p className='text-sm/6 text-gray-500 mt-1'>Total de citas: {historialPaciente.totalCitas}</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                {/* Contenido del modal */}
                {loadingHistorial ? (
                  // Loading state
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                    <p className="ml-4 text-gray-600">Cargando historial...</p>
                  </div>
                ) : historialPaciente ? (
                  <div className="space-y-6">

                    {/* Lista de citas */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {historialPaciente.citas.map((cita) => (
                        <div key={cita.idCita} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          {/* Header de la cita */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">Cita #{cita.idCita}</h4>
                              <p className="text-sm text-gray-600">
                                {formatFechaHistorial(String(cita.FechaCita))} • {cita.HoraCita.slice(0, 5)} • {cita.Duracion}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(cita.DescripcionEstado)}`}>
                              {cita.DescripcionEstado}
                            </span>
                          </div>

                          {/* Detalles de la cita */}
                          <div className="space-y-3">
                            {cita.Diagnostico && (
                              <div>
                                <h5 className="font-medium text-gray-700 text-sm mb-1">Diagnóstico:</h5>
                                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                                  {cita.Diagnostico}
                                </p>
                              </div>
                            )}
                            
                            {cita.Tratamiento && (
                              <div>
                                <h5 className="font-medium text-gray-700 text-sm mb-1">Tratamiento:</h5>
                                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded border-l-4 border-green-200">
                                  {cita.Tratamiento}
                                </p>
                              </div>
                            )}

                            {cita.observaciones && (
                              <div>
                                <h5 className="font-medium text-gray-700 text-sm mb-1">Observaciones:</h5>
                                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border-l-4 border-yellow-200">
                                  {cita.observaciones}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Footer con información adicional */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Estado: {cita.estadoCita}</span>
                              <span>Duración: {cita.Duracion}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer del modal */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Mostrando {historialPaciente.citas.length} cita(s) del historial
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={closeModal}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cerrar
                        </button>
                        <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                          Agendar Nueva Cita
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Estado vacío
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay historial disponible</h3>
                    <p className="text-gray-500">Este paciente aún no tiene citas registradas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}