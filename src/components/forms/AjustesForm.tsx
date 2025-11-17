// src/components/forms/AjustesForm.tsx
'use client'
import { User, Mail, Map, Lock, GraduationCap, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import FormSection from "./FormSection";

interface PersonalData {
  PrimerNombre: string;
  SegundoNombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Rut: string;
  FechaNacimiento: string;
}

interface ContactData {
  correo: string;
  telefono: string;
}

interface AddressData {
  comuna: string;
  calle: string;
  numero: string;
  idDireccion: number;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfessionalData {
  especialidad: string;
  valorSesion: string;
  descripcion: string;
}

interface AjustesFormProps {
  userType: 'psicologo' | 'paciente';
  userId: number;
  onLoadData: (userId: number) => Promise<any>;
  onUpdatePersonal: (data: PersonalData & { userId: number }) => Promise<void>;
  onUpdateContact: (data: ContactData & { userId: number }) => Promise<void>;
  onUpdateAddress: (data: AddressData & { userId: number }) => Promise<void>;
  onUpdatePassword: (data: PasswordData & { userId: number }) => Promise<void>;
  comunas: any[];
  showProfessionalSection?: boolean;
  professionalData?: any;
  onUpdateProfessional?: (data: any) => Promise<void>;
  specialties?: any[];
}

export default function AjustesForm({
  userType,
  userId,
  onLoadData,
  onUpdatePersonal,
  onUpdateContact,
  onUpdateAddress,
  onUpdatePassword,
  comunas,
  showProfessionalSection = false,
  onUpdateProfessional,
  specialties = []
}: AjustesFormProps) {
    
  // Estados locales simples
  const [personalData, setPersonalData] = useState<PersonalData>({
    PrimerNombre:  '',
    SegundoNombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Rut: '',
    FechaNacimiento: '',
  });

  const [contactData, setContactData] = useState<ContactData>({
    correo: '',
    telefono: '',
  });

  const [addressData, setAddressData] = useState<AddressData>({
    comuna: '',
    calle: '',
    numero: '',
    idDireccion: 0,
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [professionalData, setProfessionalData] = useState<ProfessionalData>({
    especialidad: '',
    valorSesion: '',
    descripcion: '',
  });

  // Handlers de cambio para cada formulario
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfessionalData(prev => ({ ...prev, [name]: value }));
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      console.log('Fetching data for userId:', userId);
      try {
        const data = await onLoadData(userId);
        console.log('Fetched user data:', data);
        
        // Actualizar datos personales
        setPersonalData({
          PrimerNombre: data[0].primerNombre || '',
          SegundoNombre: data[0].segundoNombre || '',
          ApellidoPaterno: data[0].apellidoPaterno || '',
          ApellidoMaterno: data[0].apellidoMaterno || '',
          Rut: data[0].rut || '',
          FechaNacimiento: data[0].fechaNacimiento ? new Date(data[0].fechaNacimiento).toISOString().split('T')[0] : '',
        });

        // Actualizar datos de contacto
        setContactData({
          correo: data[0].correo || '',
          telefono: data[0].telefono || ''
        });

        // Actualizar datos de dirección
        setAddressData({
          comuna: data[0].ComunaIdComuna?.toString() || '',
          calle: data[0].Calle || '',
          numero: data[0].Numero?.toString() || '',
          idDireccion: data[0].IdDireccion || 0
        });

        // Actualizar datos profesionales si aplica
        if (showProfessionalSection && data[0].ValorSesion) {
          setProfessionalData({
            especialidad: data[0].EspecialidadIdEspecialidad?.toString() || '',
            valorSesion: data[0].ValorSesion || '',
            descripcion: data[0].Descripcion || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchData();
  }, [userId, onLoadData, showProfessionalSection]);

  // Handlers de submit
  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdatePersonal({ ...personalData, userId });
      alert('Información personal actualizada');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateContact({ ...contactData, userId });
      alert('Información de contacto actualizada');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateAddress({ ...addressData, userId });
      alert('Dirección actualizada');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfessional) return;
    
    try {
      await onUpdateProfessional({ ...professionalData, userId });
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
      await onUpdatePassword({ ...passwordData, userId });
      alert('Contraseña actualizada');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pt-12 p-6 md:p-8">
      <div className="space-y-12">
        {/* Información Personal */}
        <FormSection
          icon={User}
          iconBgColor="bg-blue-500"
          title="Información Personal"
          description={userType === 'psicologo' 
            ? "Para modificar los campos desabilitados ponte en contacto con soporte." 
            : "Mantén tu información personal actualizada."
          }
          onSubmit={handlePersonalSubmit}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="PrimerNombre" className="block text-sm/6 font-medium text-gray-900">
                Primer Nombre
              </label>
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
              <label htmlFor="SegundoNombre" className="block text-sm/6 font-medium text-gray-900">
                Segundo Nombre
              </label>
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
              <label htmlFor="ApellidoPaterno" className="block text-sm/6 font-medium text-gray-900">
                Apellido Paterno
              </label>
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
              <label htmlFor="ApellidoMaterno" className="block text-sm/6 font-medium text-gray-900">
                Apellido Materno
              </label>
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
              <label htmlFor="Rut" className="block text-sm/6 font-medium text-gray-900">
                RUT
              </label>
              <div className="mt-2">
                <input
                  id="Rut"
                  name="Rut"
                  type="text"
                  value={personalData.Rut}
                  onChange={handlePersonalChange}
                  disabled={userType === 'psicologo'|| userType === 'paciente'}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="FechaNacimiento" className="block text-sm/6 font-medium text-gray-900">
                Fecha de Nacimiento
              </label>
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
        </FormSection>

        {/* Información de Contacto */}
        <FormSection
          icon={Mail}
          iconBgColor="bg-green-400"
          title="Información de Contacto"
          description="Utiliza un correo electrónico válido para recibir notificaciones."
          onSubmit={handleContactSubmit}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="correo" className="block text-sm/6 font-medium text-gray-900">Correo Electrónico</label>
              <div className="mt-2">
                <input
                  id="correo"
                  name="correo"
                  type="correo"
                  value={contactData.correo}
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
        </FormSection>

        {/* Dirección */}
        <FormSection
          icon={Map}
          iconBgColor="bg-purple-500"
          title="Dirección"
          description="Actualiza tu dirección de residencia."
          onSubmit={handleAddressSubmit}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="comuna" className="block text-sm/6 font-medium text-gray-900">
                Comuna
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="comuna"
                  name="comuna"
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Información Profesional (solo para psicólogos) */}
        {showProfessionalSection && (
          <FormSection
            icon={GraduationCap}
            iconBgColor="bg-amber-400"
            title="Información Profesional"
            description="Esta información será mostrada públicamente."
            onSubmit={handleProfessionalSubmit}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
          </FormSection>
        )}

        {/* Cambiar Contraseña */}
        <FormSection
          icon={Lock}
          iconBgColor="bg-rose-500"
          title="Cambiar Contraseña"
          description="Actualiza la contraseña asociada a tu cuenta."
          onSubmit={handlePasswordSubmit}
          showBorder={false}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-full">
              <label htmlFor="currentPassword" className="block text-sm/6 font-medium text-gray-900">
                Contraseña Actual
              </label>
              <div className="mt-2">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
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
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );
}