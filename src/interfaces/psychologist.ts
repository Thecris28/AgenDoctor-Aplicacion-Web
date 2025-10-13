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

