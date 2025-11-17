

import { getComunas } from "@/services/comunasService";
import AjustesPacienteComponent from "./AjustesPaciente";


type Comuna = {
    IdComuna: number;
    NombreComuna: string;
    CiudadIdCiudad: number;
}


export default async function AjustesPage() {
    // Los datos se cargan en el servidor antes del renderizado
    let comunas = [] as Comuna[];
    
    
    try {
        const comunasResponse = await getComunas();
        comunas = comunasResponse.data || [];

    } catch (error) {
        console.error('Error loading comunas on server:', error);
        // Los datos estarán vacíos, pero la página se renderizará
    }

    return (
        <AjustesPacienteComponent comunas={comunas} />
    );
}

