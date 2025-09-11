import { Especialidad, Profesional } from '../interfaces/agendamiento';

export const especialidades: Especialidad[] = [
  {
    id: '1',
    nombre: 'Medicina General',
    descripcion: 'Consultas médicas generales, chequeos preventivos y atención primaria',
    icono: 'stethoscope'
  },
//   {
//     id: '2',
//     nombre: 'Cardiología',
//     descripcion: 'Especialista en enfermedades del corazón y sistema cardiovascular',
//     icono: 'heart'
//   },
//   {
//     id: '3',
//     nombre: 'Dermatología',
//     descripcion: 'Cuidado de la piel, cabello, uñas y enfermedades dermatológicas',
//     icono: 'user'
//   },
//   {
//     id: '4',
//     nombre: 'Pediatría',
//     descripcion: 'Atención médica especializada para bebés, niños y adolescentes',
//     icono: 'baby'
//   },
//   {
//     id: '5',
//     nombre: 'Ginecología',
//     descripcion: 'Salud reproductiva femenina y atención ginecológica integral',
//     icono: 'user-check'
//   },
  {
    id: '6',
    nombre: 'Psicología',
    descripcion: 'Evaluación y tratamiento de problemas emocionales y de salud mental',
    icono: 'brain'
  },
//   {
//     id: '7',
//     nombre: 'Traumatología',
//     descripcion: 'Tratamiento de lesiones del sistema musculoesquelético',
//     icono: 'bone'
//   },
//   {
//     id: '8',
//     nombre: 'Oftalmología',
//     descripcion: 'Cuidado integral de la salud visual y enfermedades oculares',
//     icono: 'eye'
//   }
];

export const profesionales: Profesional[] = [
  // Medicina General
  {
    id: '1',
    nombre: 'Dr. Carlos Mendoza Rivera',
    especialidad: '1',
    titulo: 'Médico Cirujano',
    experiencia: '15 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    nombre: 'Dra. Patricia Morales',
    especialidad: '1',
    titulo: 'Médico Familiar',
    experiencia: '12 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  
  // Cardiología
  {
    id: '3',
    nombre: 'Dr. Fernando Castillo',
    especialidad: '2',
    titulo: 'Cardiólogo Intervencionista',
    experiencia: '18 años de experiencia',
    avatar: 'https://images.pexels.com/photos/6749739/pexels-photo-6749739.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    nombre: 'Dra. María González',
    especialidad: '2',
    titulo: 'Cardióloga Clínica',
    experiencia: '14 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // Dermatología
  {
    id: '5',
    nombre: 'Dr. Juan Pérez Soto',
    especialidad: '3',
    titulo: 'Dermatólogo',
    experiencia: '10 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '6',
    nombre: 'Dra. Valentina Rojas',
    especialidad: '3',
    titulo: 'Dermatóloga Estética',
    experiencia: '9 años de experiencia',
    avatar: 'https://images.pexels.com/photos/6749888/pexels-photo-6749888.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // Pediatría
  {
    id: '7',
    nombre: 'Dra. Ana Silva Herrera',
    especialidad: '4',
    titulo: 'Pediatra',
    experiencia: '16 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '8',
    nombre: 'Dr. Miguel Vargas',
    especialidad: '4',
    titulo: 'Neonatólogo',
    experiencia: '13 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // Ginecología
  {
    id: '9',
    nombre: 'Dra. Carmen López',
    especialidad: '5',
    titulo: 'Ginecóloga Obstetra',
    experiencia: '17 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '10',
    nombre: 'Dra. Sofía Ramírez',
    especialidad: '5',
    titulo: 'Ginecóloga',
    experiencia: '11 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452297/pexels-photo-5452297.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // Psicología
  {
    id: '11',
    nombre: 'Psic. Andrea Fuentes',
    especialidad: '6',
    titulo: 'Psicóloga Clínica',
    experiencia: '8 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '12',
    nombre: 'Psic. Ricardo Muñoz',
    especialidad: '6',
    titulo: 'Psicólogo Infantil',
    experiencia: '12 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452205/pexels-photo-5452205.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // Traumatología
  {
    id: '13',
    nombre: 'Dr. Roberto Torres',
    especialidad: '7',
    titulo: 'Traumatólogo',
    experiencia: '20 años de experiencia',
    avatar: 'https://images.pexels.com/photos/6749862/pexels-photo-6749862.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '14',
    nombre: 'Dr. Alejandro Vega',
    especialidad: '7',
    titulo: 'Cirujano Ortopédico',
    experiencia: '15 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5452216/pexels-photo-5452216.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // Oftalmología
  {
    id: '15',
    nombre: 'Dra. Claudia Espinoza',
    especialidad: '8',
    titulo: 'Oftalmóloga',
    experiencia: '13 años de experiencia',
    avatar: 'https://images.pexels.com/photos/5327540/pexels-photo-5327540.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '16',
    nombre: 'Dr. Sebastián Herrera',
    especialidad: '8',
    titulo: 'Cirujano Oftalmólogo',
    experiencia: '19 años de experiencia',
    avatar: 'https://images.pexels.com/photos/6749796/pexels-photo-6749796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const horariosDisponibles = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
  '17:00', '17:30', '18:00', '18:30'
];

// Datos simulados de disponibilidad por profesional
export const disponibilidadProfesionales = {
  '1': { // Dr. Carlos Mendoza
    diasDisponibles: [1, 2, 3, 4, 5], // Lunes a Viernes
    horariosOcupados: {
      '2024-01-15': ['09:00', '10:30', '15:00'],
      '2024-01-16': ['08:30', '11:00', '16:30'],
    }
  },
  '2': { // Dra. Patricia Morales
    diasDisponibles: [1, 2, 3, 4, 6], // Lunes a Jueves y Sábado
    horariosOcupados: {
      '2024-01-15': ['10:00', '14:30'],
      '2024-01-16': ['09:30', '15:30', '17:00'],
    }
  },
  // Agregar más disponibilidad según sea necesario
};