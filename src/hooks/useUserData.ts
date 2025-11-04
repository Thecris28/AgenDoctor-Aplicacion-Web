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

export interface PsycologistData {
  ValorSesion: string;
  Descripcion: string;
  EspecialidadIdEspecialidad: number;
  Especialidad: string;
  CorreoElectronico: string;
  PrimerNombre: string;
  SegundoNombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Telefono: string;
  Rut: string;
  FechaNacimiento: Date;
  Calle: string;
  Numero: number;
  ComunaIdComuna: number;
  IdDireccion: number;
}

export const useUserData = () => {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user || !user.idPersona) {
      console.log('No user or idPersona found:', user);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching data for user:', user);

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
          
          if (!user.idPsicologo) {
            throw new Error('ID de psicólogo no encontrado en el usuario');
          }
          const psychologistDataArray: PsycologistData[] = await getPsychologistDataById(user.idPsicologo);

          if (!psychologistDataArray || psychologistDataArray.length === 0) {
            throw new Error('No se encontraron datos del psicólogo');
          }

          const psychologistData = psychologistDataArray[0]; 

          setUserData({
            id: user.idPsicologo,
            idusuario: user.idUsuario,
            nombre: `${psychologistData.PrimerNombre || ''} ${psychologistData.ApellidoPaterno || ''}`.trim(),
            PrimerNombre: psychologistData.PrimerNombre,
            SegundoNombre: psychologistData.SegundoNombre,
            ApellidoPaterno: psychologistData.ApellidoPaterno,
            ApellidoMaterno: psychologistData.ApellidoMaterno,
            email: psychologistData.CorreoElectronico || user.email,
            telefono: psychologistData.Telefono,
            idPsicologo: user.idPsicologo,
            especialidad: psychologistData.Especialidad,
            valorSesion: psychologistData.ValorSesion,
            descripcion: psychologistData.Descripcion,
          });

          break;
        }

        case 'admin': {
          setUserData({
            id: user.idUsuario,
            nombre: 'Administrador',
            email: user.email,
          });
          break;
        }

        default: {
          throw new Error(`Rol de usuario no reconocido: ${user.role}`);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refetch = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { userData, isLoading, error, refetch };
};