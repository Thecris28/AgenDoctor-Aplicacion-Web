import { Horas } from '@/interfaces/agendamiento';
import { getTimeSlots } from '@/services/psicologoService';
import React, { useEffect, useState } from 'react';

interface Props {
  selectedTime: string | null;
  onTimeSelect: (hora: Horas) => void;
  profesionalId: number;
  fecha: Date;
}

const TimeSlots = ({ selectedTime, onTimeSelect, profesionalId, fecha }: Props) => {
  const [horariosDisponibles, setHorariosDisponibles] = useState<Horas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear la fecha a dd/mm/aaaa
  const formatearFecha = (fecha: Date): string => {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  useEffect(() => {
    // Evitar llamadas innecesarias
    if (!profesionalId || !fecha) {
      return;
    }
    
    const fetchTimeSlots = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fechaFormateada = formatearFecha(fecha);
        
        console.log('Fecha formateada:', fechaFormateada);

        const horarios = await getTimeSlots(profesionalId, fechaFormateada);
        
        console.log('Horarios obtenidos:', horarios);
        setHorariosDisponibles(horarios);
      
      } catch (error) {
        console.error('Error al obtener horarios:', error);
        setHorariosDisponibles([]);
        setError('Error al cargar los horarios disponibles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [fecha, profesionalId]);

  // Slots ocupados para ejemplo
  const takenSlots = [''];

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 h-auto max-h-70">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Horarios Disponibles
      </h3>
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {horariosDisponibles.map((hora) => {
          // Verificar si HoraCita es un objeto o una cadena
          const horaCita = typeof hora === 'string' ? hora : hora.HoraCita;
          
          const isTaken = takenSlots.includes(horaCita);
          const isSelected = selectedTime === horaCita;
          
          return (
            <button
              key={hora.IdCita}
              onClick={() => onTimeSelect(hora)}
              disabled={isTaken}
              className={`
                py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${isTaken 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
                }
              `}
            >
              {horaCita}
            </button>
          );
        })}
      </div>
      
      {horariosDisponibles.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay horarios disponibles para esta fecha
        </div>
      )}
        </>)
      }
      <div className="flex items-end space-x-6 mt-6 text-xs grow-1">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-gray-600">Seleccionado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span className="text-gray-600">No disponible</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;