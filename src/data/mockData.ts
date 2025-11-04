import { Especialidad } from '../interfaces/agendamiento';

export const especialidades: Especialidad[] = [
  {
    id: 0,
    nombre: 'Todos los Psicologos',
    descripcion: 'Ver todos los profesionales disponibles',
    icono: 'user'
  },
  {
    id: 1,
    nombre: 'Psicología Clínica',
    descripcion: 'Atención psicológica para adultos y adolescentes',
    icono: 'brain'
  },
  {
    id: 2,
    nombre: 'Psicología Infantil',
    descripcion: 'Evaluación y tratamiento psicológico para niños',
    icono: 'child'
  },
  {
    id: 3,
    nombre: 'Terapia Familiar',
    descripcion: 'Intervenciones terapéuticas para familias',
    icono: 'users'
  },
  {
    id: 4,
    nombre: 'Neuropsicología',
    descripcion: 'Evaluación y tratamiento de trastornos neurológicos',
    icono: 'cpu'
  },
];


// export const horariosDisponibles = [
//   '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
//   '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
//   '17:00', '17:30', '18:00', '18:30'
// ];

// Datos simulados de disponibilidad por profesional
// export const disponibilidadProfesionales = {
//   '1': { // Dr. Carlos Mendoza
//     diasDisponibles: [1, 2, 3, 4, 5], // Lunes a Viernes
//     horariosOcupados: {
//       '2024-01-15': ['09:00', '10:30', '15:00'],
//       '2024-01-16': ['08:30', '11:00', '16:30'],
//     }
//   },
//   '2': { // Dra. Patricia Morales
//     diasDisponibles: [1, 2, 3, 4, 6], // Lunes a Jueves y Sábado
//     horariosOcupados: {
//       '2024-01-15': ['10:00', '14:30'],
//       '2024-01-16': ['09:30', '15:30', '17:00'],
//     }
//   },
//   // Agregar más disponibilidad según sea necesario
// };