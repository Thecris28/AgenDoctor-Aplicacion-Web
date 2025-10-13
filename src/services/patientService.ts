import { patient } from "@/interfaces/patient";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export async function getPatientId(id: number) {
    const response = await fetch(`${API_URL}/usuarios/obtener_id/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Error fetching patient ID');
    }
    const data = await response.json();
    return data;
}

export async function getPatientData(id: number) {
    console.log("Fetching patient data for ID:", id);
    const response = await fetch(`${API_URL}/usuarios/datosPaciente/?IdPersona=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Error fetching patient data');
    }
    const data = await response.json();
    return data as patient[];
}

export async function newAppointment(appointmentData: any) {
    console.log("Creating new appointment with data:", appointmentData);
    const response = await fetch(`${API_URL}/paciente/agendar/nueva_cita`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
        throw new Error('Error creating new appointment');
    }
    const data = await response.json();
    return data;
}

export async function sendEmailConfirmation(emailData: any) {
    console.log("Sending email confirmation with data:", emailData);
    const response = await fetch(`${API_URL}/api/v1/email/confirmar-cita`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    });
    if (!response.ok) {
        throw new Error('Error sending email confirmation');
    }
    const data = await response.json();
    console.log("Email confirmation response data:", data);
    return data;
}