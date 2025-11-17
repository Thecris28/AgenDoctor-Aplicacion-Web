

import {
  Calendar,
  Clock,
  Star
} from "lucide-react";
import Link from "next/link";
import { Psicologo } from "@/interfaces/agendamiento";
import FavoriteButton from "./FavoriteButton";
import Image from "next/image";


interface PsychologistCardProps {
  name?: string;
  title?: string;
  location?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  joinedDate?: string;
  description?: string;
  profileImage?: string;
  psicologo: Psicologo; 
}

export default function PsychologistCard({
  psicologo,
  description = "Como psicólogo clínico con experiencia en TCC, me apasiona ayudar a las personas a desarrollar herramientas efectivas para el manejo del estrés y la mejora del bienestar mental. Entiendo que la terapia va más allá de las técnicas y debe estar arraigada en las necesidades individuales de cada paciente.",
}: PsychologistCardProps) {


  const rating = Math.floor(Math.random() * 5) + 1;

  const horarioAtencion = "Lunes a Viernes, 9:00 - 18:00";

  const searchImage = (id : number) => {
    return `https://randomuser.me/api/portraits/women/${id}.jpg`;
  }

  const sliceName = (name:string) => {
    return name.split(" ")[0] + " " + name.split(" ")[2] + " " + name.split(" ")[3];
  };

  const renderStar = (rating: number) => {
    const star = [];
    for (let i = 1; i <= 5; i++) {
      star.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? "#fbbf24" : "none"}
          stroke={i <= rating ? "#fbbf24" : "#d1d5db"}
          className={`${ i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return star;
  };
  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-1.5 shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="relative h-32 bg-gradient-to-br rounded-t-xl from-blue-400 via-blue-500 to-cyan-400">
        {/* Decorative curved lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/10 rounded-full"
                style={{
                  width: `${200 + i * 40}px`,
                  height: `${200 + i * 40}px`,
                  top: "-50%",
                  right: `${-100 - i * 20}px`,
                  transform: "rotate(45deg)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Edit button */}
        <FavoriteButton />

        {/* Profile image */}
        <div className="absolute -bottom-13 left-1/2 transform -translate-x-1/2">
          <div className="w-30 h-30 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center overflow-hidden">
            {searchImage ? (
              <Image
                width={120}
                height={120}
                src={searchImage(psicologo.IdPsicologo+4)}
                alt={psicologo.NombreCompleto}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {psicologo.NombreCompleto
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}

                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 px-4 pb-4">
        {/* Name and title */}
        <div className="mb-3">
          <h1 className="text-gray-900 mt-5 text-2xl font-medium tracking-tight mb-2">
            {sliceName(psicologo.NombreCompleto)}
          </h1>
          <p className=" text-blue-500 text-base font-medium tracking-tight">
            {psicologo.NombreEspecialidad}
          </p>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {/* Contact information */}
        <div className="space-y-2 mb-3">
          {/* {psicologo.Ubicacion && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-1 flex-shrink-0" />
              <span>{psicologo.Ubicacion}</span>
            </div>
          )} */}

          {(
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1 flex-shrink-0" />
              <span>{horarioAtencion}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-1 flex-shrink-0" />
            <span>
              Sesión: $
              {parseInt(psicologo.ValorSesion).toLocaleString("es-CL")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-gray-500">
            <Link
              href={`/appointment?psicologo=${psicologo.IdPsicologo}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Agendar
            </Link>
          </div>
          <div className="flex space-x-1 items-center">
            <div className="text-sm text-gray-500 pr-1">
              {rating}
            </div>
            {renderStar(rating)}
          </div>
        </div>
      </div>
    </div>
  );
}
