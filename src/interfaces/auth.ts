

export interface User {
  IdUsuario: number;
  CorreoElectronico: string;
  GoogleId: string | null;
  PersonaIdPersona: number;
  PsicologoIdPsicologo: number | null;
  TipoUsuarioId: number;
  Token: string | null;
  auth_method: 'local' | 'google' | string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}


// 
export interface BaseRegistration {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastName: string;
  phone: string;
}

export interface PatientRegistration extends BaseRegistration {
  birthdate: string;
  gender: string;
  medicalHistory?: string;
}

export interface PsychologistRegistration extends BaseRegistration {
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: number;
  education: string;
  biography?: string;
}

export interface ResponseProfesional {
  message:     string;
  result:      string;
  profesional: Profesional;
}

export interface Profesional {
  idProfesional:   number;
  nroRegistro:     string;
  nombre:          string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  fechaRegistro:   Date;
  nacionalidad:    string;
  rut:             string;
  universidad:     string;
  titulo:          string;
  especialidad:    string;
  observaciones:   string;
  antecedentes:    any[];
}
