type Comuna = {
    IdComuna: number;
    NombreComuna: string;
    CiudadIdCiudad: number;
}

type responseComunas = {
    success: boolean;
    data: Comuna[];
    count: number;
}

export async function getComunas() {

    const API_URL = 'http://localhost:3000';

    const response = await fetch(`${API_URL}/usuarios/todasLasComunas`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener comunas');
    }
    const data: responseComunas = await response.json();
    
    return data.data;
}
