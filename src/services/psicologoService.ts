import { Horas } from "@/interfaces/agendamiento";
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

  return data;
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

