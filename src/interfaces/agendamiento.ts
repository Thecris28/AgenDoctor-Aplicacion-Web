export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface Profesional {
  id: string;
  nombre: string;
  especialidad: string;
  titulo: string;
  experiencia: string;
  avatar: string;
}

export interface HorarioDisponible {
  hora: string;
  disponible: boolean;
}

export interface Cita {
  id: string;
  paciente: {
    nombre: string;
    email: string;
    telefono: string;
    rut: string;
  };
  profesional: Profesional;
  fecha: string;
  hora: string;
  especialidad: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
}

export interface Psicologo {
  IdPsicologo:        number;
  NombreCompleto:     string;
  NombreEspecialidad: string;
  CorreoElectronico:  string;
  ValorSesion:        string;
  Descripcion:        string;
  Telefono:           string;
  Rut:                string;
  IdEspecialidad:     number;
}

export interface Horas {
  IdCita:   number;
  HoraCita: string;
}

export interface Psicologo2 {
  IdPsicologo:        number;
  NombreCompleto:     string;
  NombreEspecialidad: string;
  CorreoElectronico:  string;
  ValorSesion:        string;
  Descripcion:        string;
  Telefono:           string;
  Rut:                string;
  IdEspecialidad:     number;
}

