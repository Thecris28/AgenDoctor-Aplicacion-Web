import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  currentStep: number;
}

const steps = [
  'Seleccionar Especialidad',
  'Elegir Profesional',
  'Fecha y Hora',
  'Datos Personales',
  'Confirmación'
];

const ProgresSteps= ({ currentStep }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                  ${isCompleted 
                    ? 'bg-blue-600 text-white' 
                    : isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <p className={`
                  text-xs mt-2 text-center max-w-20 leading-tight
                  ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}
                `}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-8 sm:w-16 h-0.5 mx-2 transition-colors duration-200
                  ${stepNumber < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgresSteps;