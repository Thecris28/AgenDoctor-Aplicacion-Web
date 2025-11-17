'use client';

import { Psicologo } from '@/interfaces/agendamiento';
import { Calendar, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'

interface CardProfesionalProps {
    psicologo: Psicologo;
    imagen?: string;
}


export default function CardProfesional({ psicologo, imagen }: CardProfesionalProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const nombre_psicologo = psicologo.NombreCompleto;
    const horarioAtencion = "Lun-Vie 9:00 - 18:00";
    const ValorSesion = psicologo.ValorSesion;
    const rating = 4.5

    // Información adicional para el dropdown
    const descripcion = psicologo.Descripcion || "Psicólogo clínico con más de 10 años de experiencia en terapia cognitivo-conductual, especializado en tratamiento de ansiedad, depresión y trastornos del estado de ánimo. Enfoque terapéutico centrado en el paciente con técnicas basadas en evidencia científica.";
    const especialidades = [psicologo.NombreEspecialidad]
    const educacion = "Magíster en Psicología Clínica - Universidad de Chile";
    const experiencia = "10+ años de experiencia clínica";

    const renderStar = (rating: number) => {
        const star = [];
        for (let i = 1; i <= 5; i++) {
            star.push(
                <Star
                    key={i}
                    size={16}
                    fill={i <= rating ? "#fbbf24" : "none"}
                    stroke={i <= rating ? "#fbbf24" : "#d1d5db"}
                    className={`${i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                />
            );
        }
        return star;
    };

    return (
        <div className='border border-gray-200 rounded-lg bg-white shadow-sm h-fit'>
            {/* Header del profesional */}
            <div className='border-b border-gray-200'>
                <div className='flex flex-col p-5 items-center md:flex-row space-x-4'>
                    <div className="w-18 h-18 rounded-full overflow-hidden bg-gray-100">
                        <div className="w-18 h-18 rounded-full overflow-hidden bg-gray-100">
                            {imagen ? (
                                <Image
                                    src={`/${imagen}`}
                                    width={72}
                                    height={72}
                                    alt={`${psicologo.NombreCompleto}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Si la imagen falla al cargar, ocultar la imagen y mostrar iniciales
                                        const imgElement = e.currentTarget;
                                        const initialsDiv = imgElement.parentElement?.querySelector('.initials-fallback') as HTMLElement;
                                        if (initialsDiv) {
                                            imgElement.style.display = 'none';
                                            initialsDiv.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}

                            <div
                                className="initials-fallback w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold"
                                style={{ display: imagen ? 'none' : 'flex' }}
                            >
                                {psicologo.NombreCompleto?.split(' ')[0].charAt(0).toUpperCase()}
                                {/* {psicologo.NombreCompleto?.split(' ').map(name => name.charAt(0)).join('').substring(2, 3).toUpperCase()} */}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center md:items-start mt-4 md:mt-0'>
                        <h2 className='font-bold text-lg'>{nombre_psicologo}</h2>
                        <span className='text-sm text-blue-500 font-medium'>{psicologo.NombreEspecialidad}</span>
                    </div>
                    {/* <div className='flex-grow flex justify-center md:justify-end mt-4 md:mt-0'>
                        <button className='bg-gray-50 border border-gray-200 py-2 px-3 mr-2 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'>
                            Agendar Cita
                        </button>
                    </div> */}
                </div>
            </div>

            {/* Información básica */}
            <div className='flex flex-col md:grid md:grid-cols-3 md:gap-0'>
                <div className='bg-gray-50 md:rounded-bl-lg py-4 px-3 flex items-center justify-center col-span-1 text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200'>
                    <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <Clock size={16} className="mr-3 flex-shrink-0" />
                        <span>{horarioAtencion}</span>
                    </div>
                </div>
                <div className='bg-gray-50 flex py-4 px-3 items-center justify-center col-span-1 text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200'>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1 flex-shrink-0" />
                        <span>
                            Sesión: ${parseInt(ValorSesion).toLocaleString("es-CL")}
                        </span>
                    </div>
                </div>
                <div className={`bg-gray-50 flex py-4 px-3 items-center justify-center col-span-1 text-center md:text-left ${!isExpanded ? 'rounded-b-lg' : ''}`}>
                    <div className="flex space-x-1 items-center">
                        <div className="text-sm text-gray-500 pr-1">
                            {rating}
                        </div>
                        {renderStar(rating)}
                    </div>
                </div>
            </div>

            {/* Botón para expandir/contraer */}
            <div className='border-t border-gray-200'>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='w-full py-3 px-4 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50 transition-colors rounded-b-lg'
                >
                    <span className='text-sm font-medium'>
                        {isExpanded ? 'Ver menos información' : 'Ver más información'}
                    </span>
                    {isExpanded ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </button>
            </div>

            {/* Información expandida */}
            {isExpanded && (
                <div className='border-t border-gray-200 bg-gray-50 rounded-b-lg p-6 space-y-4'>
                    {/* Descripción */}
                    <div>
                        <h3 className='font-semibold text-gray-900 mb-2'>Descripción</h3>
                        <p className='text-sm text-gray-600 leading-relaxed'>
                            {descripcion}
                        </p>
                    </div>

                    {/* Especialidades */}
                    <div>
                        <h3 className='font-semibold text-gray-900 mb-2'>Especialidades</h3>
                        <div className='flex flex-wrap gap-2'>
                            {especialidades.map((esp, index) => (
                                <span
                                    key={index}
                                    className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'
                                >
                                    {esp}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Educación y Experiencia */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <h3 className='font-semibold text-gray-900 mb-2'>Educación</h3>
                            <p className='text-sm text-gray-600'>{educacion}</p>
                        </div>
                        <div>
                            <h3 className='font-semibold text-gray-900 mb-2'>Experiencia</h3>
                            <p className='text-sm text-gray-600'>{experiencia}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
