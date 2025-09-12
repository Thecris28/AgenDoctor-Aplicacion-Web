
// Aquí están centralizadas las funciones para login y registro

import { PatientRegistration, PsychologistRegistration, ResponseProfesional, User } from "@/interfaces/auth";

const API_URL = 'http://localhost:3000/usuarios/login/';

export async function getLogin(email: string, password: string) {

   const response = await fetch(`${API_URL}`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ CorreoElectronico: email, Contrasena:password }),
   });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data as User[];
}

const API_REGISTER_URL = 'http://localhost:3000/usuarios/registro_psicologo';

export async function registerPsychologist(psychologistData:any) {
  console.log('Iniciando registro con datos:', psychologistData);
  
    const response = await fetch(API_REGISTER_URL, {
    method: 'POST',
    body: JSON.stringify(psychologistData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log('Respuesta del registro:', data.message);

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;

}

export async function registerPatient(patientData: PatientRegistration) {
  const response = await fetch('https://tu-api.com/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  if (!response.ok) {
    throw new Error('Error en registro');
  }
  console.log('Respuesta del registro:', response);
  return response.json();
}

export async function verifyPsychologistRut(rut: string) {
  try {
    console.log('Iniciando verificación para RUT:', rut);
    
    // URL de la API de verificación (reemplaza con tu endpoint real)
    const API_VERIFY_URL = 'https://api-superintendencia-salud.onrender.com/api/profesional/buscar';
    
    const response = await fetch(`${API_VERIFY_URL}/${rut}`, {
      method: 'GET',
    });
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      // Manejar diferentes códigos de error
      if (response.status === 404) {
        return {
          isValid: false,
          error: 'RUT no encontrado en el registro'
        };
      } else if (response.status === 500) {
        return {
          isValid: false,
          error: 'Error interno del servidor'
        };
      } else {
        return {
          isValid: false,
          error: `Error ${response.status}: ${response.statusText}`
        };
      }
    }

    const data: ResponseProfesional = await response.json();
    console.log('Datos recibidos:', data);
    
    // Procesar la respuesta según la estructura de tu API
    if (data && data.message === 'Profesional encontrado') {
      return {
        isValid: true,
        professional: data.profesional 
      };
    } else if (data.message === 'Profesional no encontrado') {
      return {
        isValid: false,
        error: data.message || 'RUT no válido'
      };
    } else {
      return {
        isValid: false,
        error: 'No se encontraron datos para este RUT'
      };
    }
    
  } catch (error) {
    console.error('Error al verificar RUT:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        isValid: false,
        error: 'Error de conexión. Verifica tu internet.'
      };
    }
    
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}