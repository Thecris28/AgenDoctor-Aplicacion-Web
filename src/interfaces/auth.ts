

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
  secondName: string;
  lastName: string;
  secondLastName: string;
  phone: string;
  rut: string;
}

export interface PatientRegistration extends BaseRegistration {
  birthdate: string;
  gender?: string;
  medicalHistory?: string;
  address: string;
  idcomuna: number;
  numberAddress?: string;
  IdTipoUsuario: number;
}

export interface PsychologistRegistration extends BaseRegistration {
  idSpecialty: number;
  dateOfBirth: string;
  yearsOfExperience?: number;
  education?: string;
  biography?: string;
  sessionPrice: number;
  IdTipoUsuario: number;
  address: string;
  numberAddress?: string;
  Idcomuna: number;
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
  antecedentes:    Antecedente[];
}
interface Antecedente {
  idAntecedente: number,
  descripcion: string,
  tipoAntecedente: string,
  fechaAntecedente: string,
  estadoAntecedente: string,
  institucion: string
}
export interface RegisterPatient {
  Calle:             string;
  Numero:            number;
  IdComuna:          number;
  PrimerNombre:      string;
  SegundoNombre:     string;
  ApellidoPaterno:   string;
  ApellidoMaterno:   string;
  Telefono:          string;
  FechaNacimiento:   string;
  CorreoElectronico: string;
  Contrasena:        string;
  IdTipoUsuario:     number;
  Rut:               string;
}

