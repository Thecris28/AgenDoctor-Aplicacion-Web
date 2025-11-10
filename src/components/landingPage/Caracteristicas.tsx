import { inter } from "@/app/layout";
import Image from "next/image";

export default function Caracteristicas() {
    return (
        <section className="md:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 mb-12">
                <div className="text-left mb-16">
                    <h2 className={`text-3xl md:text-4xl font-bold tracking-tight text-gray-900 ${inter.className}`}>
                        Aplicación Android AgenDoctor
                    </h2>
                    <p className={`text-xl md:text-3xl max-w-xl font-bold tracking-tight text-gray-500 ${inter.className}`}>
                        Accede a la salud mental desde tu dispositivo móvil
                    </p>
                </div>

            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 bg-[#F4F5F6] rounded-2xl py-14">

                {/* Grid principal con mockup y características */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
                    {/* Mockup del teléfono */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <Image src="/android-mockup.png" width={300} height={600} alt="Mockup Android" />
                        </div>
                    </div>

                    {/* Grid de características 2x2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <div className="col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-sky-500 hover:bg-blue-400/10">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-blue600 font-bold text-xl">📱</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Interfaz Intuitiva</h3>
                            <p className="text-gray-600 text-sm">Navegación fácil y diseño adaptado para móviles</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-sky-500 hover:bg-blue-400/10">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-green-600 font-bold text-xl">⚡</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Acceso Rápido</h3>
                            <p className="text-gray-600 text-sm">Agenda citas en segundos desde tu teléfono</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-sky-500 hover:bg-blue-400/10">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-purple-600 font-bold text-xl">🔔</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Notificaciones</h3>
                            <p className="text-gray-600 text-sm">Recordatorios de citas y mensajes del psicólogo</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-sky-500 hover:bg-blue-400/10">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-orange-600 font-bold text-xl">💬</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Chat Integrado</h3>
                            <p className="text-gray-600 text-sm">Comunícate con tu psicólogo entre sesiones</p>
                        </div>
                        {/* Google Play Badge */}
                        <div className="flex items-center mt-6 justify-center md:justify-start">
                            <Image src="/google-badge.png" width={150} height={200} alt="Google Play Badge" />
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}