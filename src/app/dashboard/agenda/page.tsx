'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Plus, X, Check, Coffee, User, AlertCircle, Calendar, Edit3, Trash2 } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import { getPsychologistAppointments, getTimePsychologist, setSchedule } from '@/services/psicologoService'
import Modal from './Modal'
import { Schedule } from '@/interfaces/agendamiento'
import { PsychologistAppointments } from '@/interfaces/psychologist'
import Link from 'next/link'

type EventType = 'disponible' | 'bloqueo' | 'descanso'| 'agendado' | 'completada'
type PlantillaType = 'completa' | 'manana' | 'tarde' | 'noche'

interface HorarioSlot {
  id: number
  fecha: string
  hora: string
  tipo: EventType
  titulo?: string
  descripcion?: string
  disponible: boolean
}

// interface PacienteSeguimiento {
//   id: number
//   nombre: string
//   ultimaCita: string
//   diasSinCita: number
//   motivo: string
//   prioridad: 'alta' | 'media' | 'baja'
//   telefono?: string
// }

interface DisponibilidadDia {
  fecha: string
  disponible: boolean
  horarios: string[]
}

export default function AgendaPage() {
  const { userData } = useUserData()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [horariosDelDia, setHorariosDelDia] = useState<Schedule[]>([])
  
  const [loading, setLoading] = useState(false)
  
  // Estados para modales
  const [showHorarioModal, setShowHorarioModal] = useState(false)
  const [showPlantillaModal, setShowPlantillaModal] = useState(false)
  const [editingHorario, setEditingHorario] = useState<Schedule | null>(null)

  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalText, setModalText] = useState('')
  const [diasDisponibles, setDiasDisponibles] = useState<DisponibilidadDia[]>([])
  const [citas, setCitas] = useState<PsychologistAppointments[]>([]);
  
  // Estados para formularios
  const [nuevoHorario, setNuevoHorario] = useState({
    hora: '',
    tipo: 'disponible' as EventType,
    titulo: '',
    descripcion: ''
  })
  
  const [plantillaConfig, setPlantillaConfig] = useState({
    tipo: 'completa' as PlantillaType,
    fechaInicio: '',
    fechaFin: ''
  })

  // Plantillas de horarios
  const plantillasHorarios = {
    completa: ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'],
    manana: ['08:00', '09:30', '11:00', '12:30'],
    tarde: ['14:00', '15:30', '17:00', '18:30'],
    noche: ['20:00', '21:30']
  }

  const loadHorariosDelDia = async () => {
      if (!userData?.idPsicologo) return
      try {
        const horarios = await getTimePsychologist(userData.idPsicologo, selectedDate)
        setHorariosDelDia(horarios)
      } catch (error) {
        console.error('Error al cargar horarios:', error)
      }

    }

    const fetchCitas = async () => {
        setLoading(true);
        if (!userData?.idPsicologo) return;
        try {
          const response = await getPsychologistAppointments(
            userData?.idPsicologo
          );
          setCitas(response);
          console.log("Citas fetched:", response);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {
    loadHorariosDelDia()
    loadHorariosDelDia()
    fetchCitas()
  }, [selectedDate, userData?.idPsicologo])

  

  // const loadPacientesSeguimiento = async () => {
  //   // Simular carga de pacientes que necesitan seguimiento
  //   const mockPacientes: PacienteSeguimiento[] = [
  //     {
  //       id: 1,
  //       nombre: 'María García',
  //       ultimaCita: '2025-10-15',
  //       diasSinCita: 6,
  //       motivo: 'Seguimiento post-crisis',
  //       prioridad: 'alta',
  //       telefono: '+56912345678'
  //     },
  //   ]
  //   setPacientesSeguimiento(mockPacientes)
  // }

  

  const editarHorario = async () => {
    if (!editingHorario) return

    // setHorariosDelDia(prev => 
    //   prev.map(horario => 
    //     horario.idCita === editingHorario.idCita 
    //       ? { ...editingHorario, disponible: editingHorario.tipo === 'disponible' }
    //       : horario
    //   )
    // )
    cerrarHorarioModal()
  }

  const eliminarHorario = (id: number) => {
    setHorariosDelDia(prev => prev.filter(h => h.idCita !== id))
  }

  const aplicarPlantilla = async () => {
    if (!plantillaConfig.fechaInicio || !plantillaConfig.fechaFin) return

    setLoading(true)
    try {
      
      const response  = await setSchedule({
          IdPsicologo: userData?.idPsicologo,
          tipoPlantilla: plantillaConfig.tipo,
          fechaInicio: plantillaConfig.fechaInicio,
          fechaFin: plantillaConfig.fechaFin
        })
        setShowPlantillaModal(false)
        setModalText(`Horario aplicado: Con ${(response).fechasCreadas} día(s) y ${(response).horasCreadas} horas`)
        setModalSuccess(true)
        // alert(`Plantilla aplicada: ${(response).fechasCreadas} días con ${(response).horasCreadas} horarios`)
        loadHorariosDelDia()
      
    } catch (error) {
      alert('Error al aplicar plantilla')
    } finally {
      setLoading(false)
    }
  }

  const cerrarHorarioModal = () => {
    setShowHorarioModal(false)
    setEditingHorario(null)
    setNuevoHorario({
      hora: '',
      tipo: 'disponible',
      titulo: '',
      descripcion: ''
    })
  }

  const abrirEditarHorario = (horario: Schedule) => {
    setEditingHorario(horario)
    setShowHorarioModal(true)
  }

  const getIconoTipo = (tipo: EventType) => {
    switch (tipo) {
      case 'disponible': return <Clock className="h-4 w-4 text-green-600" />
      case 'descanso': return <Coffee className="h-4 w-4 text-orange-600" />
      case 'bloqueo': return <X className="h-4 w-4 text-red-600" />
      case 'agendado': return <User className="h-4 w-4 text-blue-600" />
      case 'completada': return <Check className="h-4 w-4 text-green-600" />
    }
  }

  const getColorTipo = (tipo: EventType) => {
    switch (tipo) {
      case 'disponible': return 'bg-green-200 text-green-800 border-green-300'
      case 'descanso': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'bloqueo': return 'bg-red-100 text-red-800 border-red-200'
      case 'agendado': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'completada': return 'bg-violet-200 text-violet-500 border-violet-300'
    }
  }

  const getPrioridadColor = (prioridad: 'pendiente' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'pendiente': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baja': return 'bg-green-100 text-green-800'
    }
  }
  

  const generarDiasDisponibles = () => {
    if (!plantillaConfig.fechaInicio || !plantillaConfig.fechaFin) return

    const dias: DisponibilidadDia[] = []
    const inicio = new Date(plantillaConfig.fechaInicio)
    const fin = new Date(plantillaConfig.fechaFin)

    for (let fecha = new Date(inicio); fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
      const fechaStr = fecha.toISOString().split('T')[0]
      const diaSemana = fecha.getDay()
      
      // Excluir domingos por defecto
      if (diaSemana !== 0) {
        dias.push({
          fecha: fechaStr,
          disponible: true,
          horarios: plantillasHorarios[plantillaConfig.tipo]
        })
      }
    }
    
    setDiasDisponibles(dias)
  }

  const toggleDiaDisponible = (fecha: string) => {
    setDiasDisponibles(prev => 
      prev.map(dia => 
        dia.fecha === fecha 
          ? { ...dia, disponible: !dia.disponible }
          : dia
      )
    )
  }
   const formatFecha = (fecha: string) => {
    const [year, month, day] = fecha.split("-").map(Number);
    // Si el formato es YYYY-MM-DD
    if (year && month && day) {
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Agenda</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPlantillaModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-purple-600"
          >
           Agregar horarios para citas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Gestión de Horarios del Día */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Horarios del Día</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg px-3 py-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 text-base"
              />
            </div>

            <div className="space-y-3 scroll-auto overflow-y-auto max-h-[600px]">
              {horariosDelDia.map((horario) => (
                <div
                  key={horario.idCita}
                  className={`p-4 border rounded-lg flex items-center justify-between ${
                    horario.DescripcionEstado === 'Disponible' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getIconoTipo(horario.DescripcionEstado === 'En progreso' ? 'disponible' :
                      horario.DescripcionEstado === 'Programada' ? 'agendado' : 'completada')}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{(horario.HoraCita).split(':').join(',').slice(0, 5).replace(',', ':')}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getColorTipo(horario.DescripcionEstado === 'En progreso' ?  'disponible' : 'agendado')}`}>
                          {horario.DescripcionEstado === 'En progreso' ? 'Disponible' : 
                           horario.DescripcionEstado === 'Descanso' ? 'Descanso' : 'Agendado'}
                        </span>
                        {horario.DescripcionEstado === 'Completada' && (
                          <span className="px-2 py-1 text-xs bg-violet-200 text-violet-500 rounded-full">
                            Finalizado
                          </span>
                        )}
                        {horario.DescripcionEstado === 'Programada' && (
                          <span className="px-2 py-1 text-xs bg-red-200 text-red-500 rounded-full">
                            Sin finalizar
                          </span>
                        )}
                      </div>
                      {horario.DescripcionEstado && (
                        <p className="text-sm text-gray-600 mt-1 capitalize"> {`${horario.NombrePaciente ? 'Paciente:' + ' ' + horario.NombrePaciente : ''}`}</p>
                      )}
                      {horario.DescripcionEstado && (
                        <p className="text-xs text-gray-500"> {horario.DescripcionEstado}</p>
                      )}
                      
                    </div>
                  </div>

                  {(horario.DescripcionEstado === 'En progreso') && (
                    <div className="flex items-center gap-2">

                    <button
                      onClick={() => abrirEditarHorario(horario)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => eliminarHorario(horario.idCita)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>)}
                </div>
              ))}

              {horariosDelDia.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay horarios configurados para este día</p>
                  <button
                    onClick={() => setShowPlantillaModal(true)}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Agregar primer horario
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna 2: Pacientes que Necesitan Seguimiento */}
        <div>
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">Citas pendientes para finalizar.</h2>
            </div>

            <div className="space-y-4">
              {citas.filter(paciente => paciente.estado_cita === 'Programada').length > 0 ? (
    // Si hay citas programadas, las muestra
    citas.filter(paciente => paciente.estado_cita === 'Programada')
      .map((paciente) => (
        <div key={paciente.idCita} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 capitalize">
              {paciente.paciente.nombreCompleto.split(' ')[0] + ' ' + paciente.paciente.nombreCompleto.split(' ')[3]}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${paciente.estado_cita==='Programada' ? getPrioridadColor('pendiente') : ''}`}>
              {paciente.estado_cita === 'Programada' ? 'Sin completar' : ''}
            </span>
          </div>
        
          <div className="space-y-1 text-sm text-gray-600">
            <p>Fecha cita: {formatFecha(paciente.fechaCita)}</p>
            <p>Hora cita: <span className="font-medium">{paciente.horaCita}</span></p>
            <p>Fecha actual: <span className="font-medium">{new Date().toLocaleDateString('es-CL')}</span></p>
          </div>

          <div className="flex gap-2 mt-3">
            <Link href={`/dashboard/citas`} className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm text-center rounded hover:bg-blue-600">
              Completar cita
            </Link>
          </div>
        </div>
      ))
  ) : (
    // Si no hay citas programadas, muestra el estado vacío
    <div className="text-center py-6 text-gray-500">
      <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
      <p className="text-sm">Todos los pacientes al día</p>
    </div>
  )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalSuccess}  onClose={() => setModalSuccess(false)} text={modalText} /> 
      
      {/* Modal para Agregar/Editar Horario */}
      {showHorarioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingHorario ? 'Editar Horario' : 'Agregar Horario'}
                </h3>
                <button onClick={cerrarHorarioModal} className="p-1 hover:bg-gray-100 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={editingHorario?.HoraCita || nuevoHorario.hora}
                    onChange={(e) => editingHorario
                      ? setEditingHorario({...editingHorario, HoraCita: e.target.value})
                      : setNuevoHorario({...nuevoHorario, hora: e.target.value})
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={editingHorario?.DescripcionEstado || nuevoHorario.tipo}
                    onChange={(e) => editingHorario
                      ? setEditingHorario({...editingHorario, DescripcionEstado: e.target.value as EventType})
                      : setNuevoHorario({...nuevoHorario, tipo: e.target.value as EventType})
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="disponible">⏰ Disponible para citas</option>
                    <option value="descanso">☕ Descanso</option>
                    <option value="bloqueo">🚫 Bloqueado</option>
                  </select>
                </div>

                {((editingHorario?.DescripcionEstado !== 'disponible') || (nuevoHorario.descripcion !== 'disponible')) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={editingHorario?.DescripcionEstado || nuevoHorario.hora}
                        onChange={(e) => editingHorario
                          ? setEditingHorario({...editingHorario, DescripcionEstado: e.target.value})
                          : setNuevoHorario({...nuevoHorario, descripcion: e.target.value})
                        }
                        placeholder="Ej: Almuerzo, Reunión, etc."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        value={editingHorario?.DescripcionEstado || nuevoHorario.descripcion}
                        onChange={(e) => editingHorario
                          ? setEditingHorario({...editingHorario, DescripcionEstado: e.target.value})
                          : setNuevoHorario({...nuevoHorario, descripcion: e.target.value})
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarHorarioModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={editarHorario}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingHorario ? 'Guardar Cambios' : 'Crear Horario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Aplicar Plantilla */}
      {showPlantillaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Configurar Horarios de Disponibilidad</h3>
                <button onClick={() => setShowPlantillaModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Selección de plantilla */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plantilla de Horarios
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(plantillasHorarios).map(([key, horarios]) => (
                      <div
                        key={key}
                        onClick={() => setPlantillaConfig({...plantillaConfig, tipo: key as PlantillaType})}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          plantillaConfig.tipo === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-medium capitalize mb-2">{key}</h4>
                        <div className="text-sm text-gray-600">
                          {horarios.length} horarios
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rango de fechas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={plantillaConfig.fechaInicio}
                      onChange={(e) => setPlantillaConfig({...plantillaConfig, fechaInicio: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={plantillaConfig.fechaFin}
                      onChange={(e) => setPlantillaConfig({...plantillaConfig, fechaFin: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Vista previa de días */}
                {plantillaConfig.fechaInicio && plantillaConfig.fechaFin && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Días Disponibles (Vista Previa)
                      </label>
                      <button
                        onClick={() => {generarDiasDisponibles()}}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Actualizar Vista
                      </button>
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {diasDisponibles.map((dia) => (
                        <div
                          key={dia.fecha}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={dia.disponible}
                              onChange={() => toggleDiaDisponible(dia.fecha)}
                              className="rounded"
                            />
                            <span className="text-sm">
                              {new Date(dia.fecha + 'T00:00:00').toLocaleDateString('es-CL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {dia.horarios.length} horarios
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información de la plantilla seleccionada */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Plantilla Seleccionada: {plantillaConfig.tipo.charAt(0).toUpperCase() + plantillaConfig.tipo.slice(1)}
                  </h4>
                  <div className="text-sm text-blue-700">
                    <strong>Horarios:</strong> {plantillasHorarios[plantillaConfig.tipo].join(', ')}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    * Los domingos están excluidos automáticamente
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowPlantillaModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {aplicarPlantilla()}}
                  disabled={loading || !plantillaConfig.fechaInicio || !plantillaConfig.fechaFin}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Aplicando...' : 'Aplicar Plantilla'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
      )}
      
    </div>
  )
}