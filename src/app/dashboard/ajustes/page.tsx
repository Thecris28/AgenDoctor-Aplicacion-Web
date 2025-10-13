// src/app/dashboard/ajustes/page.tsx
import { getComunas } from '@/services/comunasService';
import AjustesClientComponent from './AjustesClient';
import { getSpecialties } from '@/services/psicologoService';
import { Specialties } from '@/interfaces/psychologist';

type Comuna = {
    IdComuna: number;
    NombreComuna: string;
    CiudadIdCiudad: number;
}


export default async function AjustesPage() {
    // Los datos se cargan en el servidor antes del renderizado
    let comunas = [] as Comuna[];
    let specialties = [] as Specialties[];
    
    try {
        const comunasResponse = await getComunas();
        comunas = comunasResponse.data || [];

        const specialtiesResponse = await getSpecialties();
        specialties = specialtiesResponse || [];
    } catch (error) {
        console.error('Error loading comunas on server:', error);
        // Los datos estarán vacíos, pero la página se renderizará
    }

    return (
        <AjustesClientComponent comunas={comunas} specialties={specialties} />
    );
}