import { inter } from '@/app/layout'
import { especialidades } from '@/data/mockData'
import Image from 'next/image'
import React from 'react'

export default function Especialidades() {
  return (
    <section className='py-20 bg-white'>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-start text-left mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight text-gray-900 ${inter.className}`}>
            Especialidades
          </h2>
          <p className={`text-xl md:text-3xl max-w-xl font-bold tracking-tight text-gray-500 ${inter.className}`}>
            Descubre nuestras áreas de enfoque.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {especialidades.slice(1).map((esp) => (
            <div key={esp.id} className="text-center rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-gray-50 border border-gray-200 hover:border-sky-500 hover:bg-blue-400/10">
              <div className="w-full">
                <Image
                 width={ 300}
                 height={ 180 }
                 src={esp.imageUrl!} alt={esp.nombre} className="w-full h-45 object-cover "/>
              </div>
               <div className='p-6'>
                <h3 className="text-xl font-semibold text-blue-500 mb-4">{esp.nombre}</h3>
                 <p className="text-gray-600">{esp.descripcion}</p>
                 <div className="mt-10">
                   <a href="#" className="text-base font-semibold text-white bg-blue-500 px-4 py-2 rounded-lg">Ver más</a>
                 </div>
                </div> 
            </div>
          ))}
      </div>
        </div>
    </section>
  )
}
