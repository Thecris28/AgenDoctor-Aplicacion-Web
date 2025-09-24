'use client'
import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, Loader } from 'lucide-react';
import { createTransaction } from '@/services/paymentService';
import { Horas, Psicologo } from '@/interfaces/agendamiento';
import { useAuthStore } from '@/store/auth.store';

interface PatientData {
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
}

interface Props {
  onSubmit: (data: PatientData) => void;
  loading?: boolean;
  citaInfo: Horas | null;
  psicologo: Psicologo | null;
  fecha: Date;
}

const PatientForm = ({ onSubmit, loading = false, citaInfo, psicologo, fecha }: Props) => {
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<PatientData>({
    nombre: '',
    email: '',
    telefono: '',
    rut: ''
  });

  const formatearFecha = (fecha: Date): string => {
    if (!fecha) return '';
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };


  const [errors, setErrors] = useState<Partial<PatientData>>({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<PatientData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Primero enviar los datos del paciente
    onSubmit(formData);
    const precioConsulta = psicologo ? parseInt(psicologo.ValorSesion) : 30000;
    // Si tenemos información de la cita, iniciar proceso de pago
    if (citaInfo && precioConsulta > 0) {
      try {
        setPaymentLoading(true);
        
        // Crear la transacción de pago
        const paymentData = await createTransaction({
          buy_order: `${citaInfo.IdCita}${Date.now()}`,
          session_id: `${formData.rut.replace(/\D/g, '')}_${Date.now()}`,
          amount: precioConsulta,
          return_url: `${window.location.origin}/commitpay`
        });

        if (!paymentData || !paymentData.url) {
          throw new Error("No se recibió la URL de pago");
        }

        if (paymentData.token && paymentData.url) {
          localStorage.setItem('idCita', JSON.stringify(citaInfo.IdCita));
          // falta llamar la api para obtener paciente id
          // localStorage.setItem('idPaciente', JSON.stringify(formData.rut));
          localStorage.setItem('correo', JSON.stringify(formData.email));
          localStorage.setItem('nombrePsicologo', JSON.stringify(psicologo?.Nombre));
          localStorage.setItem('fechaCita', JSON.stringify(formatearFecha(fecha)));
          localStorage.setItem('horaCita', JSON.stringify(citaInfo?.HoraCita));
          localStorage.setItem('idPersona', JSON.stringify(user?.idPersona));
          localStorage.setItem('idUsuario', JSON.stringify(user?.idUsuario));
          window.location.href = paymentData.url + '?token_ws=' + paymentData.token;
        }
        
      } catch (error) {
        console.error("Error iniciando pago:", error);
        alert("No se pudo iniciar el proceso de pago. Intente nuevamente.");
        setPaymentLoading(false);
      }
    }
  };

  const handleChange = (field: keyof PatientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const precioConsulta = psicologo ? parseInt(psicologo.ValorSesion) : 30000;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Datos del Paciente
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nombre Completo
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              errors.nombre 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
            placeholder="Ingrese su nombre completo"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              errors.email 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
            placeholder="ejemplo@correo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              errors.telefono 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
            placeholder="+56 9 1234 5678"
          />
          {errors.telefono && (
            <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 inline mr-2" />
            RUT
          </label>
          <input
            type="text"
            value={formData.rut}
            onChange={(e) => handleChange('rut', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              errors.rut 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 focus:outline-none`}
            placeholder="12.345.678-9"
          />
          {errors.rut && (
            <p className="text-red-500 text-sm mt-1">{errors.rut}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-1">Información de pago</h4>
          <p className="text-sm text-blue-600">
            Al confirmar, serás redirigido a WebPay para realizar el pago de tu consulta:
          </p>
          <p className="text-lg font-semibold text-blue-800 mt-2">
            ${precioConsulta.toLocaleString('es-CL')}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || paymentLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading || paymentLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              {paymentLoading ? 'Iniciando pago...' : 'Procesando...'}
            </>
          ) : (
            'Confirmar y Pagar'
          )}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;