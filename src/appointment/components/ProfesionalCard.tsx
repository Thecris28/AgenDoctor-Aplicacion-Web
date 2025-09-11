import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Profesional } from '@/interfaces/agendamiento';

interface Props {
  profesional: Profesional;
  onClick: () => void;
}

const ProfesionalCard = ({ profesional, onClick }: Props) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={profesional.avatar} 
            alt={profesional.nombre}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {profesional.nombre}
            </h3>
            <p className="text-sm text-blue-600 font-medium">
              {profesional.titulo}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {profesional.experiencia}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
    </div>
  );
};

export default ProfesionalCard;