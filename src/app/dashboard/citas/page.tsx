'use client'
import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Video, MessageCircle, CheckCircle, XCircle, AlertCircle, Filter, Search, ChevronDown, MoreHorizontal, Edit } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import Link from 'next/link';
import { getPsychologistAppointments, updateAppointment } from '@/services/psicologoService';
import { PsychologistAppointments } from '@/interfaces/psychologist';
import CitaModal from '@/components/CitaModal';


type FilterType = 'todas' | 'hoy' | 'semana' | 'mes';
type StatusFilter = 'todas' | 'Programada' | 'Completada' | 'Cancelada' | 'No Asistió';

export default function CitasPage() {
  const { userData, isLoading } = useUserData();
  const [citas, setCitas] = useState<PsychologistAppointments[]>([]);
  const [filteredCitas, setFilteredCitas] = useState<PsychologistAppointments[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<FilterType>('todas');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<PsychologistAppointments | null>(null);


  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      if (!userData?.idPsicologo) return;
      try {
        const response = await getPsychologistAppointments(userData?.idPsicologo);
        setCitas(response);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.idPsicologo) {
      fetchCitas();
    }
  }, [userData?.idPsicologo]);

  // Filtrar citas
  useEffect(() => {
    let filtered = citas;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cita =>
        cita.paciente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
        
      );
    }

    // Filtro por fecha
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (dateFilter) {
      case 'hoy':
        filtered = filtered.filter(cita => String(cita.fechaCita) === todayStr);
        break;
      case 'semana':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filtered = filtered.filter(cita => {
          const citaDate = new Date(cita.fechaCita);
          return citaDate >= weekStart && citaDate <= weekEnd;
        });
        break;
      case 'mes':
        filtered = filtered.filter(cita => {
          const citaDate = new Date(cita.fechaCita);
          return citaDate.getMonth() === today.getMonth() && 
                 citaDate.getFullYear() === today.getFullYear();
        });
        break;
    }

    // Filtro por estado
    if (statusFilter !== 'todas') {
      filtered = filtered.filter(cita => cita.estado_cita === statusFilter);
    }

    setFilteredCitas(filtered);
  }, [citas, searchTerm, dateFilter, statusFilter]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'En Curso':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'Completada':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Cancelada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'No Asistió':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 text-blue-800';
      case 'En Curso':
        return 'bg-orange-100 text-orange-800';
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'No Asistió':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenModal = (cita: PsychologistAppointments) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCita(null);
  };

  const mapEstadoCita = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 1;
      case 'Confirmada':
        return 2;
      case 'En Curso':
        return 3;
      case 'Completada':
        return 4;
      case 'Cancelada':
        return 5;
      case 'No Asistió':
        return 6;
      default:
        return 0;
    }
  }

  const handleSaveCita = async (citaId: number, data: { diagnostico: string; tratamiento: string; estado_cita: string }) => {
    
    console.log('Actualizando cita:', citaId, data);

    updateAppointment({
      IdCita: citaId,
      Diagnostico: data.diagnostico,
      Tratamiento: data.tratamiento,
      idEstadoCita: mapEstadoCita(data.estado_cita)
    });

    
    // Actualizar el estado local
    setCitas(prev => prev.map(cita => 
      cita.idCita === citaId 
        ? { ...cita, diagnostico: data.diagnostico, tratamiento: data.tratamiento, estado_cita: data.estado_cita }
        : cita
    ));
    
    // Mostrar mensaje de éxito (opcional)
    alert('Cita actualizada exitosamente');
  };

  const handleStatusChange = (citaId: number, newStatus: string) => {
    setCitas(prev => prev.map(cita => 
      cita.idCita === citaId ? { ...cita, estado_cita: newStatus as any } : cita
    ));
  };

  if (isLoading || loading) {
    return (
      <div className="p-6 pt-12 md:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Citas</h1>
        <p className="text-gray-600">Gestiona tus citas con pacientes</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por paciente o motivo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as FilterType)}
            >
              <option value="todas">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="todas">Todos los estados</option>
              <option value="Programada">Programadas</option>
              <option value="Completada">Completadas</option>
              <option value="Cancelada">Canceladas</option>
              <option value="No Asistió">No Asistió</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Citas</p>
              <p className="text-2xl font-bold text-gray-900">{citas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {citas.filter(c => c.estado_cita === 'completada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {citas.filter(c => c.estado_cita === 'programada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {citas.filter(c => String(c.fechaCita) === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-4">
        {filteredCitas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h3>
            <p className="text-gray-600">No se encontraron citas con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredCitas.map((cita) => (
            <div key={cita.idCita} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {cita.paciente.nombreCompleto.split(' ').join('').charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cita.paciente.nombreCompleto}</h3>
                        <p className="text-sm text-gray-600">
                          {cita.paciente.edad ? `${cita.paciente.edad} años` : 'Edad no especificada'}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex gap-1 w-fit ${getEstadoColor(cita.estado_cita)}`}>
                      {getEstadoIcon(cita.estado_cita)}
                      {cita.estado_cita.charAt(0).toUpperCase() + cita.estado_cita.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{String(cita.fechaCita)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{cita.horaCita}</span>
                    </div>
                    <div className="flex items-center">
                      {/* <span className={`px-2 py-1 rounded text-xs ${cita.tipo === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {cita.tipo === 'virtual' ? '💻 Virtual' : '🏥 Presencial'}
                      </span> */}
                    </div>
                  </div>

                  {/* {cita.motivo && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Motivo:</strong> {cita.motivo}
                      </p>
                      {cita.notas && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Notas:</strong> {cita.notas}
                        </p>
                      )}
                    </div>
                  )} */}
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2">
                  
                  
                  <button 
                    onClick={() => handleOpenModal(cita)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Actualizar
                  </button>
                  
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4" />
                    Mensaje
                  </button>

                  {/* Dropdown de acciones */}
                  <div className="relative group">
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      {cita.estado_cita === 'programada' && (
                        <button
                          onClick={() => handleStatusChange(cita.idCita, 'completada')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Marcar como completada
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(cita.idCita, 'cancelada')}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Cancelar cita
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Ver historial del paciente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para actualizar cita */}
      <CitaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cita={selectedCita}
        onSave={handleSaveCita}
      />
    </div>
  );
}