import React from 'react';
import { 
  Stethoscope, 
  Heart, 
  User, 
  Baby, 
  UserCheck, 
  Bone,
  Eye,
  ChevronRight,
  Brain
} from 'lucide-react';
import { Especialidad } from '@/interfaces/agendamiento';


interface Props {
  especialidad: Especialidad;
  onClick: () => void;
}

const iconMap = {
  stethoscope: Stethoscope,
  heart: Heart,
  user: User,
  baby: Baby,
  'user-check': UserCheck,
  bone: Bone,
  brain: Brain,
  eye: Eye
  
};

const EspecialidadCard = ({ especialidad, onClick }: Props) => {
  const IconComponent = iconMap[especialidad.icono as keyof typeof iconMap] || Stethoscope;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 px-3 rounded-lg group-hover:bg-blue-100 transition-colors">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {especialidad.nombre}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {especialidad.descripcion}
            </p>
          </div>
        </div>
        <div className="w-5 h-5">
           <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"/>
        </div>
      </div>
    </div>
  );
};

export default EspecialidadCard;