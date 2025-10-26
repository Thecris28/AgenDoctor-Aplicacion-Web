import { Horas, Schedule } from "@/interfaces/agendamiento";
import { DataPsychologist, Specialties } from "@/interfaces/psychologist";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export async function getAllPsychologists() {
  const response = await fetch(`${API_URL}/psicologos/get_psicologos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching psychologists');
  }

  const data = await response.json();
  console.log('Psychologists data:', data);

  return data;
}

export async function getTimeSlots(psicologoId: number, date: string) {
  const response = await fetch(`${API_URL}/psicologos/horas_psicologo/?IdPsicologo=${psicologoId}&FechaCita=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching time slots');
  }

  const data = await response.json();

  return data as Horas[];
}


export async function getPsychologistDataById(psicologoId: number) {
  const response = await fetch(`${API_URL}/psicologos/info_psicologo?idPsicologo=${psicologoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching psychologist data');
  }

  const data = await response.json();

  return data ;
}

export async function getSpecialties() {
  const response = await fetch(`${API_URL}/psicologos/allEspecialidades`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching specialties');
  }

  const data = await response.json();

  return data as Specialties[];
}

export async function updatePersonalInfo(params: DataPsychologist) {
  const response = await fetch(`${API_URL}/psicologos/patch_psicologo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error updating personal information');
  }

  const data = await response.json();

  return data;
}

export const getPsychologistAppointments = async (IdPsicologo: number) => {
  const response = await fetch(`${API_URL}/psicologos/get_citas_psicologo?IdPsicologo=${IdPsicologo}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error('Error fetching psychologist appointments',);
  }

  const data = await response.json();

  return data;

};

export async function updateAppointment(updateData: any) {
  console.log("Updating appointment with data:", updateData);
  const response = await fetch(`${API_URL}/paciente/finalizarCita`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error('Error updating appointment');
  }

  const data = await response.json();

  return data;
}

export interface ResponseSchedule {
  message:       string;
  fechasCreadas: number;
  horasCreadas:  number;
}


export async function setSchedule(setSchedule:any){
  const response = await fetch(`${API_URL}/psicologos/insertarHorarios`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setSchedule)
  })
  if(!response.ok){
    throw new Error('Error al guardar horarios')
  }
  const data = await response.json()
  return data as ResponseSchedule;
}

export async function getTimePsychologist(idPsicologo: number, fecha: string) {
  const response = await fetch(`${API_URL}/psicologos/obtenerHorariosPorFecha/?idPsicologo=${idPsicologo}&fecha=${fecha}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error('Error fetching time slots');
  }
  const data = await response.json();

  return data as Schedule[];
}

export async function patientList(idPsicologo:number) {
  const response = await fetch(`${API_URL}/psicologos/obtenerPacientes?idPsicologo=${idPsicologo}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Error fetching patient list');
  }
  const data = await response.json();

  return data;
}

export async function getPatientHistory(idPaciente: number) {
  const response = await fetch(`${API_URL}/psicologos/obtenerHistorialMedico/?idPaciente=${idPaciente}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching patient history');
  }

  const data = await response.json();

  return data;
}