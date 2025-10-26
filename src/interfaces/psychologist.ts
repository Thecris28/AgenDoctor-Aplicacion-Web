export interface DataPsychologist {
    ValorSesion?:                string;
    Descripcion?:                string;
    EspecialidadIdEspecialidad?: number;
    CorreoElectronico?:          string;
    Contrasena?:                 string;
    PrimerNombre?:               string;
    SegundoNombre?:              string;
    ApellidoPaterno?:            string;
    ApellidoMaterno?:            string;
    Telefono?:                   string;
    Rut?:                        string;
    FechaNacimiento?:            Date;
    Calle?:                      string;
    Numero?:                     number;
    ComunaIdComuna?:            number;
    IdDireccion?:               number;
    IdPsicologo?:               number;
    IdPersona?:                 number;
    IdUsuario?:                 number;
    IdComuna?:                 number;
    IdEspecialidad?:            number;
}

export interface Specialties {
    IdEspecialidad:     number;
    NombreEspecialidad: string;
}

export interface PsychologistAppointments {
    idCita:      number;
    fechaCita:   string;
    horaCita:    string;
    diagnostico: string | null;
    tratamiento: string | null;
    estado_cita: string;
    paciente:    Paciente;
}

export interface Paciente {
    idPaciente:     number;
    nombreCompleto: string;
    edad:           number;
}

export interface PatientData {
    idPaciente:     number;
    idUsuario:      number;
    nombreCompleto: string;
    rut:            string;
    correo:         string;
    telefono:       string;
    ultima_cita:    Date;
    Edad:           number;
}



