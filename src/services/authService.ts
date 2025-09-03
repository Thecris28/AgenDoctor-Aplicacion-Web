
// Aquí están centralizadas las funciones para login y registro

import { User } from "@/types/auth";

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

export async function getRegister(email: string, password: string) {
  const response = await fetch('https://tu-api.com/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Error en registro');
  }
  return response.json();
}
