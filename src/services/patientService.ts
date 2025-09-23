

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