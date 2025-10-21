'use client'
import React, { useState, useEffect } from 'react'
import { X, Save, User, Calendar, Clock, Phone, Mail, MapPin, AlertCircle } from 'lucide-react'
import { PsychologistAppointments } from '@/interfaces/psychologist'

interface CitaModalProps {
  isOpen: boolean
  onClose: () => void
  cita: PsychologistAppointments | null
  onSave: (citaId: number, data: { diagnostico: string; tratamiento: string; estado_cita: string }) => void
}

export default function CitaModal({ isOpen, onClose, cita, onSave }: CitaModalProps) {
  const [diagnostico, setDiagnostico] = useState('')
  const [tratamiento, setTratamiento] = useState('')
  const [estadoCita, setEstadoCita] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cita) {
      setDiagnostico(cita.diagnostico || '')
      setTratamiento(cita.tratamiento || '')
      setEstadoCita(cita.estado_cita)
    }
  }, [cita])

  const handleSave = async () => {
    if (!cita) return
    
    setLoading(true)
    try {
      await onSave(cita.idCita, {
        diagnostico,
        tratamiento,
        estado_cita: estadoCita
      })
      onClose()
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen || !cita) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Actualizar Cita</h2>
            <p className="text-gray-600">Gestionar diagnóstico y tratamiento</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Información del Paciente */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Información del Paciente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {cita.paciente.nombreCompleto.split(' ').join('').charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{cita.paciente.nombreCompleto}</p>
                <p className="text-sm text-gray-600">
                  {cita.paciente.edad ? `${cita.paciente.edad} años` : 'Edad no especificada'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatFecha(cita.fechaCita)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{cita.horaCita}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-6">
          {/* Estado de la Cita */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de la Cita
            </label>
            <select
              value={estadoCita}
              onChange={(e) => setEstadoCita(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Programada">Programada</option>
              <option value="En Curso">En Curso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="No Asistió">No Asistió</option>
            </select>
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnóstico
            </label>
            <textarea
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Ingresa el diagnóstico del paciente..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe el diagnóstico basado en la evaluación realizada
            </p>
          </div>

          {/* Tratamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tratamiento Recomendado
            </label>
            <textarea
              value={tratamiento}
              onChange={(e) => setTratamiento(e.target.value)}
              placeholder="Describe el plan de tratamiento recomendado..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              Incluye recomendaciones, medicamentos, terapias, seguimiento, etc.
            </p>
          </div>

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Información importante</p>
                <p className="text-sm text-blue-700 mt-1">
                  Los datos ingresados formarán parte del expediente médico del paciente y deben ser precisos y profesionales.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}