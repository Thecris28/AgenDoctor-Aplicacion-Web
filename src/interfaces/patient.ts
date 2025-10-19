
export interface patient{
    nombre:          string;
    rut:             string;
    telefono:        string;
    correo:          string;
    fechaNacimiento: Date;
    idPaciente:      number;
}
export interface PatientAppointment {
    IdCita:           number;
    IdUsuario:        number;
    fecha:            string;
    hora:             string;
    nombre_paciente:  string;
    rut_paciente:     string;
    FechaNacimiento:  string;
    Edad:             number;
    Diagnostico:      null;
    Tratamiento:      null;
    nombre_psicologo: string;
    estado_cita:      string;
    monto:            string;
    especialidad:      string;
}
