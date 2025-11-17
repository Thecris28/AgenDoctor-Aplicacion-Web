
// Aquí están centralizadas las funciones para login, registro y recuperacion de contraseñas

import { RegisterPatient, ResponseProfesional, User } from "@/interfaces/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getLogin(email: string, password: string) {

   const response = await fetch(`${API_URL}/usuarios/login/`, {
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
    return {
      data: data as User[],
      Success: true
    };
}


export async function registerPsychologist(psychologistData: any) {

    const response = await fetch(`${API_URL}/usuarios/registro_psicologo`, {
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

export async function registerPatient(patientData: RegisterPatient) {
  const response = await fetch(`${API_URL}/usuarios/insertar_paciente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  const data = await response.json();
  console.log('Respuesta del registro:', data.message);

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function verifyPsychologistRut(rut: string) {
  try {
    console.log('Iniciando verificación para RUT:', rut);
    
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
const API_RESET_URL = `${API_URL}/usuarios/guardarToken`;
export async function sendToken(CorreoElectronico: string, Token:string) {
  const response = await fetch(API_RESET_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ CorreoElectronico, Token }),
  });
  const data = await response.json();
  console.log('Respuesta del envío de token:', data);
  return data;
}

const API_EMAIL_URL = `${API_URL}/api/v1/email/recuperar-contrasena`;
export async function sendEmailRecovery(email: string, token:string) {
  console.log('Enviando email a:', email, 'con token:', token);
  const response = await fetch(API_EMAIL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token })
  });

  const data = await response.json()
  console.log('Respuesta del envío de email:', data);
  return data;
}

const API_VERIFY_OTP_URL = `${API_URL}/usuarios/validarToken`;

export const verifyOtp = async (email: string, token: string) => {
  const response = await fetch(API_VERIFY_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token }),
  });

  const data = await response.json();
  console.log('Respuesta de la verificación de OTP:', data);
  return data;
}

const API_NEW_PASSWORD_URL = `${API_URL}/usuarios/cambiar_contrasena`;
export const changePassword = async(email: string, newPassword: string) => {
  console.log('Cambiando contraseña para:', email);
  console.log('Nueva contraseña:', newPassword);
  const response = await fetch(API_NEW_PASSWORD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      CorreoElectronico:email,
      NuevaContrasena:newPassword
    })
  });

  const data = await response.json()
  console.log('Respuesta cambio de contraseña', data)
  return data;
} 