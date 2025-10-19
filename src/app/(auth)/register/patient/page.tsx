// src/app/register/patient/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowLeft, ArrowRight, User2, MapPin } from 'lucide-react';
import { registerPatient } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PatientRegistration } from '@/interfaces/auth';
import { getComunas } from '@/services/comunasService';

interface Comuna {
  IdComuna: number;
  NombreComuna: string;
  CiudadIdCiudad: number;
}

export default function PatientRegistrationPage() {

    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [comunas, setComunas] = useState<Comuna[]>([]);
    const [loadingComunas, setLoadingComunas] = useState(true);

    useEffect(() => {
        const fetchComunas = async () => {
          try {
            const data = await getComunas();
            setComunas(data.data);
          } catch (error) {
            console.error('Error al cargar comunas:', error);
          } finally {
            setLoadingComunas(false);
          }
        };
    
        fetchComunas();
      }, []); 

  const [formData, setFormData] = useState<PatientRegistration>({
    name: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phone: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
    rut: '',
    idcomuna: 0,
    address: '',
    numberAddress: '',
    IdTipoUsuario: 1, // Tipo Usuario Paciente

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setRegisterError('');
    
    try {
      console.log(formData);
      const formatedData = {
        Calle: formData.address,
        Numero: Number(formData.numberAddress),
        IdComuna: Number(formData.idcomuna),
        PrimerNombre: formData.name,
        SegundoNombre: formData.secondName,
        ApellidoPaterno: formData.lastName,
        ApellidoMaterno: formData.secondLastName,
        Telefono: formData.phone,
        FechaNacimiento: formData.birthdate,
        CorreoElectronico: formData.email,
        Contrasena: formData.password,
        IdTipoUsuario: formData.IdTipoUsuario,
        Rut: formData.rut,
      }
      await registerPatient(formatedData);
      router.push('/registrationSuccess?role=patient');
    } catch (error: any) {
      setRegisterError(error.message || 'Error al registrarse. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
      if (currentStep === 1) {
        const requiredFields = ['name', 'lastName', 'secondLastName', 'email', 'phone', 'birthdate', 'rut'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof PatientRegistration]);

        if (missingFields.length > 0) {
          setRegisterError('Por favor completa todos los campos requeridos');
          return;
        }
      }
  
      setRegisterError('');
      setCurrentStep(2);
    };
  
    const handlePrevStep = () => {
      setRegisterError('');
      setCurrentStep(1);
    };

    const renderStep1 = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>
    
          <div className='space-y-2'>
            <label htmlFor="secondName">Segundo Nombre</label>
            <div className='relative'>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="secondName"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Tu segundo nombre"
              />
            </div>
          </div>
    
          {/* Last Name field */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Apellido Paterno
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Apellido paterno"
                required
              />
            </div>
          </div>
          {/*  */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Apellido Materno
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="secondLastName"
                name="secondLastName"
                value={formData.secondLastName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Apellido materno"
                required
              />
            </div>
          </div>
    
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>
    
          {/* Phone field */}
    
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Tu número de teléfono"
                required
              />
            </div>
          </div>
    
          <div className="space-y-2">
            <label htmlFor="rut" className="text-sm font-medium text-gray-700">
              Rut
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="rut"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="18.156.777-9"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="birthdate" className="text-sm font-medium text-gray-700">
              Fecha Nacimiento
            </label>
            <div className="relative">
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Dia"
                required
              />
            </div>
          </div>
        </div>
      );

    const renderStep2 = () => (
      <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dirección - Calle */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            Calle
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Nombre de la calle"
              required
            />
          </div>
        </div>

        {/* Número */}
        <div className="space-y-2">
          <label htmlFor="numberAddress" className="text-sm font-medium text-gray-700">
            Número
          </label>
          <div className="relative">
            <input
              type="text"
              id="numberAddress"
              name="numberAddress"
              value={formData.numberAddress}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="123"
              required
            />
          </div>
        </div>

        {/* Comuna */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="idcomuna" className="text-sm font-medium text-gray-700">
            Comuna
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              id="idcomuna"
              name="idcomuna"
              value={formData.idcomuna}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
              required
            >
              <option value="">
                {loadingComunas ? 'Cargando comunas...' : 'Selecciona una comuna'}
              </option>
              {comunas.map((comuna) => (
                <option key={comuna.IdComuna} value={comuna.IdComuna}>
                  {comuna.NombreComuna}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
    );


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                 Registro de Paciente</h1>
                <span className='text-gray-600'>Crea tu cuenta para agendar citas con nuestros psicólogos</span>
                <div className=' flex items-center justify-center gap-2 mt-2'>
                  <p className=" text-gray-800 font-bold text-sm">
                  Paso {currentStep}:
                </p>
                  <p className=' text-blue-500 text-sm font-normal'>{currentStep === 1 ? ' Información Personal y Contacto.' : 'Dirección e Información Profesional.'}</p>
                </div>
              </div>
    
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">Paso {currentStep} de 2</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentStep * 50}%` }}
                  ></div>
                </div>
              </div>
    
              {/* Error Message */}
              {registerError && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl mb-4">
                  {registerError}
                </div>
              )}
    
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 ? renderStep1() : renderStep2()}
    
                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
    
    
                  {currentStep === 1 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Siguiente
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Anterior
                    </button>
                  )}
                  {currentStep === 2 && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70"
                    >
                      {isLoading ? 'Procesando...' : 'Crear cuenta de paciente'}
                    </button>
    
                  )}
                </div>
              </form>
    
              {/* Back to role selection */}
              <div className="mt-8 text-center">
                <Link
                  href="/register/roleSelection"
                  className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  ← Volver a selección de tipo de cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
  );
}