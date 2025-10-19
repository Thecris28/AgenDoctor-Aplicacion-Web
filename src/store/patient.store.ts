import { create } from "zustand";
import { persist } from "zustand/middleware";

interface patient {
    nombre: string,
    idPaciente: number,
}

interface patientStore {
    patient: patient | null;
    setPatient: (patient: patient) => void;
    updatePatient: (patientData: Partial<patient>) => void;
    clearPatient: () => void;
}

export const usePatientStore = create<patientStore>()(
    persist(
        (set, get) => ({
            patient: null,
            setPatient: (patient) => set({ patient }),
            updatePatient: (patientData: Partial<patient>) => {
                const currentPatient = get().patient;
                if (currentPatient) {
                    set({ patient: { ...currentPatient, ...patientData } });
                }
            },
            clearPatient: () => set({ patient: null }),
        }),
        {
            name: "patient-storage",
            partialize: (state) => ({ patient: state.patient }),
        }
    )
)
    