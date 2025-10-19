// src/components/forms/FormSection.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  icon: LucideIcon;
  iconBgColor: string;
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  showBorder?: boolean;
}

export default function FormSection({
  icon: Icon,
  iconBgColor,
  title,
  description,
  onSubmit,
  children,
  showBorder = true
}: FormSectionProps) {
  return (
    <form onSubmit={onSubmit} className={showBorder ? "border-b border-gray-200 pb-12" : ""}>
      <div className="flex gap-4 items-center">
        <div className={`${iconBgColor} rounded-full p-2 w-12 h-12 flex items-center justify-center`}>
          <Icon className="size-8 text-white" />
        </div>
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">{title}</h2>
          <p className="text-sm/6 text-gray-600">{description}</p>
        </div>
      </div>

      <div className="mt-10">
        {children}
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}