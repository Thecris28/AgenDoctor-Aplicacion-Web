// src/hooks/useUserData.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getPatientData } from '@/services/patientService';
import { getPsychologistDataById } from '@/services/psicologoService';

interface UserData {
  id: number;
  nombre: string;
  PrimerNombre?: string;
  SegundoNombre?: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  email: string;
  telefono?: string;
  // Campos específicos según el rol
  idusuario?: number;
  idPaciente?: number;
  idPsicologo?: number;
  especialidad?: string;
  valorSesion?: string;
  descripcion?: string;
}

export const useUserData = () => {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mover fetchUserData fuera del useEffect y usar useCallback
  const fetchUserData = useCallback(async () => {
    if (!user || !user.idPersona) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      switch (user.role) {
        case 'patient': {
          const patientData = await getPatientData(user.idPersona);
          if (patientData && patientData.length > 0) {
            const patient = patientData[0];
            setUserData({
              id: user.idUsuario,
              nombre: patient.nombre,

              email: user.email,
              telefono: patient.telefono,
              idPaciente: patient.idPaciente,
            });
          }
          break;
        }

        case 'psychologist': {
          if (user.idPsicologo) {
            const psychologistData = await getPsychologistDataById(user.idPsicologo);
            setUserData({
              id: user.idPsicologo,
              idusuario: user.idUsuario,
              nombre: psychologistData.PrimerNombre + ' ' + psychologistData.PrimerApellido,
              email: user.email,
              telefono: psychologistData.Telefono,
              idPsicologo: user.idPsicologo,
              especialidad: psychologistData.EspecialidadIdEspecialidad,
              valorSesion: psychologistData.ValorSesion,
              descripcion: psychologistData.Descripcion,
            });
          }
          break;
        }

        case 'admin': {
          // Para admin, usar datos básicos del usuario
          setUserData({
            id: user.idUsuario,
            nombre: 'Administrador',
            email: user.email,
          });
          break;
        }

        default: {
          throw new Error('Rol de usuario no reconocido');
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependencias del useCallback

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Ahora fetchUserData está disponible

  // Función refetch que puede ser llamada desde componentes
  const refetch = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { userData, isLoading, error, refetch };
};