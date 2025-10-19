'use client'
import AjustesGenerico from "@/components/forms/AjustesForm";

import { getPatientData } from "@/services/patientService";

import { useAuthStore } from "@/store/auth.store";

interface Comuna {
    IdComuna: number;
    NombreComuna: string;
    Region?: string;
}

interface Props {
    comunas: Comuna[];
}


export default function AjustesPacienteComponent({comunas}: Props) {
    const pacienteId = useAuthStore(state => state.user?.idPersona);

    const updatePatientInfo = async (updatedData: any) => {
        // Lógica para actualizar la información del paciente
        console.log("Updating patient info with data:", updatedData);
        // Aquí puedes llamar a un servicio para actualizar la información en el backend
    };

  return (
    <AjustesGenerico
      userType="paciente"
      userId={pacienteId!}
      onLoadData={getPatientData}
      onUpdatePersonal={updatePatientInfo}
      onUpdateContact={updatePatientInfo}
      onUpdateAddress={updatePatientInfo}
      onUpdatePassword={updatePatientInfo}
      comunas={comunas}
      showProfessionalSection={false}
    />
  );
}
