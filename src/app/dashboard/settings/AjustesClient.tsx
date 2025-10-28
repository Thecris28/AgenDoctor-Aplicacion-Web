'use client'
import { DataPsychologist, Specialties } from "@/interfaces/psychologist";
import { getPsychologistDataById, updatePersonalInfo } from "@/services/psicologoService";
import { useAuthStore } from "@/store/auth.store";
import { ChevronDown, Mail, Lock, User, Map, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

interface Comuna {
    IdComuna: number;
    NombreComuna: string;
    Region?: string;
}

interface Props {
    comunas: Comuna[];
    specialties: Specialties[];
}

export default function AjustesClientComponent({ comunas, specialties }: Props) {
    const psicologoId = useAuthStore(state => state.user?.idPsicologo);
    const personaId = useAuthStore(state => state.user?.idPersona);
    const usuarioId = useAuthStore(state => state.user?.idUsuario);
    
    
    // Estado para información personal
    const [personalData, setPersonalData] = useState({
        PrimerNombre: '',
        SegundoNombre: '',
        ApellidoPaterno: '',
        ApellidoMaterno: '',
        Rut: '',
        FechaNacimiento: '',
    });

    // Estado para información de contacto
    const [contactData, setContactData] = useState({
        email: '',
        telefono: '',
    });

    // Estado para dirección
    const [addressData, setAddressData] = useState({
        comuna: '',
        calle: '',
        numero: '',
        idDireccion: 0,
    });

    // Estado para información profesional
    const [professionalData, setProfessionalData] = useState({
        especialidad: '',
        valorSesion: '',
        descripcion: '',
    });

    // Estado para cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Handlers para cada formulario
    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfessionalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handlers de submit para cada formulario
    const handlePersonalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Enviando datos personales:', personalData);
            // Aquí harías la llamada a tu API
            // await updatePersonalInfo(personalData);
            alert('Información personal actualizada');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Enviando datos de contacto:', contactData);
            await updatePersonalInfo({
                IdPersona: personaId!,
                IdUsuario: usuarioId!,
                CorreoElectronico: contactData.email,
                Telefono: contactData.telefono,
            });
            alert('Información de contacto actualizada');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Enviando datos de dirección:', addressData);
            await updatePersonalInfo({
                IdPersona: personaId!,
                IdUsuario: usuarioId!,
                IdComuna: Number(addressData.comuna),
                Calle: addressData.calle,
                Numero: +addressData.numero,
                IdDireccion: +addressData.idDireccion
            });
            alert('Dirección actualizada');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleProfessionalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Enviando datos profesionales:', professionalData);
            await updatePersonalInfo({
                IdPsicologo: psicologoId!,
                IdPersona: personaId!,
                IdEspecialidad: Number(professionalData.especialidad),
                ValorSesion: professionalData.valorSesion,
                Descripcion: professionalData.descripcion
            });
            alert('Información profesional actualizada');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        try {
            console.log('Cambiando contraseña');
            // await changePassword(passwordData);
            alert('Contraseña actualizada');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        if (!psicologoId) return;
        const fetchData = async () => {
            try {
                const psychologistData = await getPsychologistDataById(psicologoId);
                const data: DataPsychologist = psychologistData[0];

                console.log('Fetched psychologist data:', data);
                
                setPersonalData({
                    PrimerNombre: data.PrimerNombre || '',
                    SegundoNombre: data.SegundoNombre || '',
                    ApellidoPaterno: data.ApellidoPaterno || '',
                    ApellidoMaterno: data.ApellidoMaterno || '',
                    Rut: data.Rut || '',
                    FechaNacimiento: data.FechaNacimiento ? new Date(data.FechaNacimiento).toISOString().split('T')[0] : '',
                });

                setContactData({
                    email: data.CorreoElectronico || '',
                    telefono: data.Telefono || ''
                })

                setAddressData({
                    comuna: data.ComunaIdComuna?.toString() || '',
                    calle: data.Calle || '',
                    numero: data.Numero!.toString() || '',
                    idDireccion: data.IdDireccion || 0

                })

                setProfessionalData({
                    especialidad: data.EspecialidadIdEspecialidad?.toString() || '',
                    valorSesion: data.ValorSesion || '',
                    descripcion: data.Descripcion || ''
                });

                // Si tienes más datos en la respuesta, los puedes cargar aquí
                // setContactData({ email: data.Email || '', telefono: data.Telefono || '' });
                // setAddressData({ comuna: data.Comuna || '', calle: data.Calle || '', numero: data.Numero || '' });
                // setProfessionalData({ especialidad: data.Especialidad || '', valorSesion: data.ValorSesion || '', descripcion: data.Descripcion || '' });
                
            } catch (error) {
                console.error('Error fetching psychologist data:', error);
            }
        };
        fetchData();
    }, [psicologoId]);

    return (
        <div className="mx-auto max-w-5xl p-6 pt-8 md:p-12">
            <div className="space-y-12">
                {/* Formulario 1: Información Personal */}
                <form onSubmit={handlePersonalSubmit} className="border-b border-gray-200 pb-12">
                    <div className="flex gap-4 items-center">
                        <div className="bg-blue-500 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                            <User className="size-8 text-blue-100" />
                        </div>
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Información Personal</h2>
                            <p className="text-sm/6 text-gray-600">Para modificar los campos desabilitados ponte en contacto con soporte.</p>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="PrimerNombre" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
                            <div className="mt-2">
                                <input
                                    id="PrimerNombre"
                                    name="PrimerNombre"
                                    type="text"
                                    value={personalData.PrimerNombre}
                                    onChange={handlePersonalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="SegundoNombre" className="block text-sm/6 font-medium text-gray-900">Segundo Nombre</label>
                            <div className="mt-2">
                                <input
                                    id="SegundoNombre"
                                    name="SegundoNombre"
                                    type="text"
                                    value={personalData.SegundoNombre}
                                    onChange={handlePersonalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="ApellidoPaterno" className="block text-sm/6 font-medium text-gray-900">Apellido Paterno</label>
                            <div className="mt-2">
                                <input
                                    id="ApellidoPaterno"
                                    name="ApellidoPaterno"
                                    type="text"
                                    value={personalData.ApellidoPaterno}
                                    onChange={handlePersonalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="ApellidoMaterno" className="block text-sm/6 font-medium text-gray-900">Apellido Materno</label>
                            <div className="mt-2">
                                <input
                                    id="ApellidoMaterno"
                                    name="ApellidoMaterno"
                                    type="text"
                                    value={personalData.ApellidoMaterno}
                                    onChange={handlePersonalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="Rut" className="block text-sm/6 font-medium text-gray-900">Rut</label>
                            <div className="mt-2">
                                <input
                                    id="Rut"
                                    name="Rut"
                                    type="text"
                                    value={personalData.Rut}
                                    onChange={handlePersonalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="FechaNacimiento" className="block text-sm/6 font-medium text-gray-900">Fecha de Nacimiento</label>
                            <div className="mt-2">
                                <input
                                    id="FechaNacimiento"
                                    name="FechaNacimiento"
                                    type="date"
                                    value={personalData.FechaNacimiento}
                                    onChange={handlePersonalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">Cancelar</button>
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Guardar
                        </button>
                    </div>
                </form>

                {/* Formulario 2: Información de Contacto */}
                <form onSubmit={handleContactSubmit} className="border-b border-gray-200 pb-12">
                    <div className="flex gap-4 items-center">
                        <div className="bg-green-400 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                            <Mail className="size-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Información de Contacto</h2>
                            <p className="text-sm/6 text-gray-600">Utiliza un correo electrónico válido para recibir notificaciones.</p>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Correo Electrónico</label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={contactData.email}
                                    onChange={handleContactChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="telefono" className="block text-sm/6 font-medium text-gray-900">Teléfono</label>
                            <div className="mt-2">
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="text"
                                    value={contactData.telefono}
                                    onChange={handleContactChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">Cancelar</button>
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Guardar
                        </button>
                    </div>
                </form>


                {/* tercera parte */}
                <form onSubmit={handleAddressSubmit} className="border-b border-gray-200 pb-12">
                    <div className="flex gap-4 items-center">
                        <div className="bg-purple-500 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                            <Map className="size-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Dirección</h2>
                            <p className="text-sm/6 text-gray-600">Actualiza tu dirección de residencia.</p>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="comuna" className="block text-sm/6 font-medium text-gray-900">
                                Comuna
                            </label>
                            <div className="mt-2 grid grid-cols-1">
                                <select
                                    id="comuna"
                                    name="comuna"
                                    autoComplete="comuna"
                                    value={addressData.comuna}
                                    onChange={handleAddressChange}
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {comunas.map((comuna) => (
                                        <option key={comuna.IdComuna} value={comuna.IdComuna}>
                                            {comuna.NombreComuna} {comuna.Region && `- ${comuna.Region}`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="calle" className="block text-sm/6 font-medium text-gray-900">
                                Calle
                            </label>
                            <div className="mt-2">
                                <input
                                    id="calle"
                                    name="calle"
                                    type="text"
                                    value={addressData.calle}
                                    onChange={handleAddressChange}
                                    autoComplete="street-address"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="numero" className="block text-sm/6 font-medium text-gray-900">
                                Numero
                            </label>
                            <div className="mt-2">
                                <input
                                    id="numero"
                                    name="numero"
                                    type="text"
                                    value={addressData.numero}
                                    onChange={handleAddressChange}
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Guardar
                        </button>
                    </div>
                </form>

                {/* cuarta parte */}

                <form onSubmit={handleProfessionalSubmit} className="border-b border-gray-200 pb-12">
                    <div className="flex gap-4 items-center">
                        <div className="bg-amber-400 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                            <GraduationCap className="size-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Información Profesional</h2>
                            <p className="text-sm/6 text-gray-600">Esta informacion sera mostrada publicamente asi que ten cuidado con lo que compartes.</p>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="especialidad" className="block text-sm/6 font-medium text-gray-900">
                                Especialidad
                            </label>
                            <div className="mt-2 grid grid-cols-1">
                                <select
                                    id="especialidad"
                                    name="especialidad"
                                    autoComplete="especialidad"
                                    value={professionalData.especialidad}
                                    onChange={handleProfessionalChange}
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                    <option value="">Selecciona una especialidad</option>
                                    {specialties.map((spec) => (
                                        <option key={spec.IdEspecialidad} value={spec.IdEspecialidad}>{spec.NombreEspecialidad}</option>
                                    ))}
                                </select>
                                <ChevronDown
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="valorSesion" className="block text-sm/6 font-medium text-gray-900">
                                Valor por Sesión (CLP)
                            </label>
                            <div className="mt-2">
                                <input
                                    id="valorSesion"
                                    name="valorSesion"
                                    type="text"
                                    value={professionalData.valorSesion}
                                    onChange={handleProfessionalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="descripcion" className="block text-sm/6 font-medium text-gray-900">
                                Biografia
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    rows={3}
                                    value={professionalData.descripcion}
                                    onChange={handleProfessionalChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            <p className="mt-3 text-sm/6 text-gray-600">Escribe una frase sobre ti.</p>
                        </div>


                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Guardar
                        </button>
                    </div>
                </form>

                <form className="border-b border-gray-200 pb-12">
                    <div className="flex gap-4 items-center">
                        <div className="bg-rose-500 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                            <Lock className="size-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Cambiar Contraseña</h2>
                            <p className="text-sm/6 text-gray-600">Actualiza la contraseña asociada a tu cuenta.</p>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-full">
                            <label htmlFor="currentPassword" className="block text-sm/6 font-medium text-gray-900">
                                Contraseña Actual
                            </label>
                            <div className="mt-2">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="text"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="newPassword" className="block text-sm/6 font-medium text-gray-900">
                                Contraseña Nueva
                            </label>
                            <div className="mt-2">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="text"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                Confirmar Contraseña Nueva
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
    )
}
