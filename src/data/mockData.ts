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

export const linksLanding = [
  { name: 'Inicio', href: '#' },
  { name: 'Especialidades', href: '#especialidades' },
  { name: 'Psicologos', href: '/search' },
  { name: 'Articulos', href: '#especialidades' },
];
