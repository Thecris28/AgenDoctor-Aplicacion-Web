import { horariosDisponibles } from '@/data/mockData';
import React from 'react';


interface Props {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  profesionalId: string;
  fecha: Date;
}

const TimeSlots = ({ selectedTime, onTimeSelect, profesionalId, fecha }: Props) => {
  // Simulate some taken slots for realism
  const takenSlots = ['10:30', '14:30', '16:00'];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Horarios Disponibles
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {horariosDisponibles.map((hora) => {
          const isTaken = takenSlots.includes(hora);
          const isSelected = selectedTime === hora;
          
          return (
            <button
              key={hora}
              onClick={() => !isTaken && onTimeSelect(hora)}
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
              {hora}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center space-x-6 mt-6 text-xs">
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