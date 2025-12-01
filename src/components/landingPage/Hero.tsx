'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";



export default function Hero() {
  const router = useRouter();

  return (
    <section className="h-5/6 grid grid-cols-1 md:grid-cols-2 items-center justify-between pt-30 pl-3 gap-40">
        <div>
            <div className="max-w-md">
            <h2 className="text-base lg:text-5xl font-bold text-blue-400 ">Tu salud mental merece prioridad.</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900">Reserva tu hora ahora.</h3>
            <p className=" text-base md:text-lg text-gray-500 pt-5">Accede desde cualquier dispositivo sin llamadas ni esperas.</p>
        </div>
        <div className="mt-4 mb-4 md:mb-0 flex flex-wrap gap-4">
            <button className="rounded-md bg-blue-500 text-base text-white px-4 py-2 hover:bg-blue-400 cursor-pointer"
            onClick={() => router.push('/search')}>Buscar un Psicologo</button>
            <button className="rounded-md bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400 cursor-pointer">Más información</button>
        </div>
        </div>
        <div className="items-center justify-center hidden md:flex">
            <Image src="/mujer.png" width={350} height={250} alt="Hero Image" />
        </div>

    </section>
  )
}
