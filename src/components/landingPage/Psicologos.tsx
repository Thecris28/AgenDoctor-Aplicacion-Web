'use client'
import { useState, useEffect } from 'react';
import { getAllPsychologists } from '@/services/psicologoService';
import { Psicologo } from '@/interfaces/agendamiento';
import CardProfesional from '@/app/appointment/profesionales/CardProfesional';



const lista_psicologas = [
  {imagen: 'mujer-psicologa.jpg'},
  {imagen: 'mujer-psicologa_2.jpg'},
]

export default function Psicologos() {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [loading, setLoading] = useState(true);

  const getImagenPorIndice = (index: number) => {
  // Si hay imagen disponible en el índice, devolverla
  if (index < lista_psicologas.length && lista_psicologas[index]?.imagen) {
    return lista_psicologas[index].imagen;
  }
  // Si no hay imagen, devolver undefined para mostrar iniciales
  return undefined;
};

  useEffect(() => {
    const fetchPsicologos = async () => {
      try {
       const getPsychologists = await getAllPsychologists()
        console.log('getPsychologists', getPsychologists)
        setPsicologos(getPsychologists);
        
      } catch (error) {
        console.error('Error al cargar los psicólogos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPsicologos();
  }, []);

  return (
    <section className='p-6 pt-30 max-w-6xl mx-auto'>
    
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profesionales</h1>
        <p className="text-gray-500 font-normal">Aquí puedes encontrar información sobre los psicólogos disponibles.</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                <div className="h-10 bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  {psicologos.map((psicologo, index) => (
    <CardProfesional 
      key={psicologo.IdPsicologo} 
      psicologo={psicologo} 
      imagen={getImagenPorIndice(index)}
    />
  ))}
</div>
      )}
    </section>
  );
}
