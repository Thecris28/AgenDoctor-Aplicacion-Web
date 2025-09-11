import { Profesional } from '@/interfaces/auth'
import { create } from 'zustand'

interface ProfesionalStore {
  profesional: Profesional | null
  setProfesional: (profesional: Profesional) => void
  clearProfesional: () => void
  getNombreCompleto: () => string
}


export const useProfesionalStore = create<ProfesionalStore>((set, get) => ({
    profesional: null,
    setProfesional: (profesional: Profesional) => set({ profesional }),
    clearProfesional: () => set({ profesional: null }),
    getNombreCompleto: () => {
      const { profesional } = get();
      return profesional ? `${profesional.nombre} ${profesional.apellidoPaterno} ${profesional.apellidoMaterno}` : '';
    }
}))