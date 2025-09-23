'use client'
import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PsychologistCard from '@/components/PsychologistCard';

// Interfaz para el psicólogo
interface Psicologo {
  IdPsicologo: number;
  Nombre: string;
  Apellido: string;
  Especialidad: string;
  ValorSesion: string;
  Descripcion: string;
  ImagenUrl: string;
  Calificacion: number;
  Ubicacion?: string;
  HorarioAtencion?: string;
}

export default function ProfesionalesPage() {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí deberías hacer la llamada a tu API para obtener los psicólogos
    // Ejemplo:
    const fetchPsicologos = async () => {
      try {
        // const response = await fetch('/api/psicologos');
        // const data = await response.json();
        // setPsicologos(data);
        
        // Datos de ejemplo mientras implementas la API
        setPsicologos([
          {
            IdPsicologo: 1,
            Nombre: "María andrea",
            Apellido: "González",
            Especialidad: "Psicología Clínica",
            ValorSesion: "45000",
            Descripcion: "Especialista en terapia cognitivo-conductual con más de 10 años de experiencia en tratamiento de ansiedad y depresión.",
            ImagenUrl: "https://randomuser.me/api/portraits/women/44.jpg",
            Calificacion: 4.9,
            Ubicacion: "Santiago Centro",
            HorarioAtencion: "Lunes a Viernes, 9:00 - 18:00"
          },
          {
            IdPsicologo: 2,
            Nombre: "Carlos",
            Apellido: "Mendoza",
            Especialidad: "Neuropsicología",
            ValorSesion: "50000",
            Descripcion: "Doctor en neuropsicología con enfoque en trastornos del aprendizaje y evaluación cognitiva en adultos mayores.",
            ImagenUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            Calificacion: 4.7,
            Ubicacion: "Providencia",
            HorarioAtencion: "Martes a Sábado, 10:00 - 19:00"
          },
          {
            IdPsicologo: 3,
            Nombre: "Ana",
            Apellido: "Soto",
            Especialidad: "Psicología Infantil",
            ValorSesion: "40000",
            Descripcion: "Especialista en desarrollo infantil, problemas de conducta y orientación a padres. Enfoque lúdico y familiar.",
            ImagenUrl: "https://randomuser.me/api/portraits/women/68.jpg",
            Calificacion: 3.9,
            Ubicacion: "Las Condes",
            HorarioAtencion: "Lunes a Viernes, 14:00 - 20:00"
          }
        ]);
        
      } catch (error) {
        console.error('Error al cargar los psicólogos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPsicologos();
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profesionales</h1>
        <p className="text-gray-500 font-normal">Aquí puedes encontrar información sobre los psicólogos disponibles.</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                <div className="h-10 bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-6">
          {psicologos.map(psicologo => (
            <PsychologistCard key={psicologo.IdPsicologo} psicologo={psicologo} />
          ))}
        </div>
      )}
    </>
  );
}