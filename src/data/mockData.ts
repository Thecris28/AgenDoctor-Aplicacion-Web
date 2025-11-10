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
    icono: 'brain',
    imageUrl: 'https://res.cloudinary.com/dinscegxc/image/upload/v1762734400/que-es-la-psicologia-clinica_fsqmbb.jpg'
  },
  {
    id: 2,
    nombre: 'Psicología Infantojuvenil',
    descripcion: 'Evaluación y tratamiento psicológico para niños y adolescentes',
    icono: 'child',
    imageUrl: 'https://res.cloudinary.com/dinscegxc/image/upload/v1762734401/psicologia-infantil-1_o3kpui.jpg'
  },
  {
    id: 3,
    nombre: 'Terapia Familiar',
    descripcion: 'Intervenciones terapéuticas para familias',
    icono: 'users',
    imageUrl: 'https://res.cloudinary.com/dinscegxc/image/upload/v1762734970/terapia-psicologica-familiar_ebhhxd.png'
  },
  {
    id: 4,
    nombre: 'Neuropsicología',
    descripcion: 'Evaluación y tratamiento de trastornos neurológicos',
    icono: 'cpu',
    imageUrl: 'https://res.cloudinary.com/dinscegxc/image/upload/v1762734400/Ilustracion-cerebro-como-concepto-de-neuropsicologia-clinica_ivf8oi.jpg'
  },
];

export const linksLanding = [
  { name: 'Inicio', href: '/' },
  { name: 'Especialidades', href: '#especialidades' },
  { name: 'Psicologos', href: '/search' },
//   { name: 'Articulos', href: '#especialidades' },
];
