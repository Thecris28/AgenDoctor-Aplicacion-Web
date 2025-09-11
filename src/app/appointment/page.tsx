
'use client'
import AppointmentSummary from '@/appointment/components/AppointmentSummary';
import PatientForm from '@/appointment/components/PatienForm';
import ProfesionalCard from '@/appointment/components/ProfesionalCard';
import ProgresSteps from '@/appointment/components/ProgresStep';
import TimeSlots from '@/appointment/components/TimeSlots';
import Calendar from '@/components/Calendar'
import EspecialidadCard from '@/components/EspecialidadCard';
import { especialidades, profesionales } from '@/data/mockData';
import { Especialidad, Profesional } from '@/interfaces/agendamiento';
import { ArrowLeft, Calendar1, Clock } from 'lucide-react';
import React, { useState }  from 'react'

type Step = 'especialidad' | 'profesional' | 'fecha-hora' | 'datos' | 'confirmacion';

export default function AppointmentPage() {
    
  const [currentStep, setCurrentStep] = useState<Step>('especialidad');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<Especialidad | null>(null);
  const [selectedProfesional, setSelectedProfesional] = useState<Profesional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStepNumber = (step: Step): number => {
    const stepMap = {
      'especialidad': 1,
      'profesional': 2,
      'fecha-hora': 3,
      'datos': 4,
      'confirmacion': 5
    };
    return stepMap[step];
  };

  const handleEspecialidadSelect = (especialidad: Especialidad) => {
    setSelectedEspecialidad(especialidad);
    setSelectedProfesional(null);
    setCurrentStep('profesional');
  };

  const handleProfesionalSelect = (profesional: Profesional) => {
    setSelectedProfesional(profesional);
    setCurrentStep('fecha-hora');
  };

  const handleDateTimeComplete = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('datos');
    }
  };

  const handlePatientSubmit = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPatientData(data);
    setLoading(false);
    setCurrentStep('confirmacion');
  };

  const handleNewAppointment = () => {
    setCurrentStep('especialidad');
    setSelectedEspecialidad(null);
    setSelectedProfesional(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setPatientData(null);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'profesional':
        setCurrentStep('especialidad');
        break;
      case 'fecha-hora':
        setCurrentStep('profesional');
        break;
      case 'datos':
        setCurrentStep('fecha-hora');
        break;
      default:
        break;
    }
  };

  const canGoBack = currentStep !== 'especialidad' && currentStep !== 'confirmacion';

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgresSteps currentStep={getStepNumber(currentStep)} />

        {canGoBack && (
          <button
            onClick={handleBack}
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        )}

        {currentStep === 'especialidad' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Seleccione una Especialidad
            </h2>
            <p className="text-gray-600 mb-8">
              Escoja la especialidad médica que necesita para su consulta
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {especialidades.map((especialidad) => (
                <EspecialidadCard
                  key={especialidad.id}
                  especialidad={especialidad}
                  onClick={() => handleEspecialidadSelect(especialidad)}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === 'profesional' && selectedEspecialidad && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Profesionales en {selectedEspecialidad.nombre}
            </h2>
            <p className="text-gray-600 mb-8">
              Seleccione el profesional de su preferencia
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {profesionales
                .filter(prof => prof.especialidad === selectedEspecialidad.id)
                .map((profesional) => (
                  <ProfesionalCard
                    key={profesional.id}
                    profesional={profesional}
                    onClick={() => handleProfesionalSelect(profesional)}
                  />
                ))}
            </div>
          </div>
        )}

        {currentStep === 'fecha-hora' && selectedProfesional && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Fecha y Hora
            </h2>
            <p className="text-gray-600 mb-8">
              Consulta con {selectedProfesional.nombre}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Calendar 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              
              {selectedDate && (
                <TimeSlots
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  profesionalId={selectedProfesional.id}
                  fecha={selectedDate}
                />
              )}
            </div>

            {selectedDate && selectedTime && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleDateTimeComplete}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'datos' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmar Cita
            </h2>
            <p className="text-gray-600 mb-8">
              Complete sus datos para confirmar la cita médica
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Resumen de la Cita</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedProfesional!.avatar} 
                      alt={selectedProfesional!.nombre}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedProfesional!.nombre}</p>
                      <p className="text-gray-600">{selectedProfesional!.titulo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">

                    <Calendar1 className="w-4 h-4 text-blue-600" />
                    
                    <p className="text-gray-700">
                      {selectedDate && new Intl.DateTimeFormat('es-CL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).format(selectedDate)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-gray-700">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <PatientForm
                onSubmit={handlePatientSubmit}
                loading={loading}
              />
            </div>
          </div>
        )}

        {currentStep === 'confirmacion' && selectedProfesional && selectedDate && selectedTime && patientData && (
          <AppointmentSummary
            profesional={selectedProfesional}
            fecha={selectedDate}
            hora={selectedTime}
            paciente={patientData}
            onNewAppointment={handleNewAppointment}
          />
        )}
      </div>
    </div>
  );
}
