'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { commitTransaction } from '@/services/paymentService';
import { newAppointment, sendEmailConfirmation } from '@/services/patientService';

export default function CommitPayPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Procesando resultado del pago...');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  // Los datos vienen desde el componente patientForm y se guardan en localStorage
  const searchParams = useSearchParams();
  
  // WebPay envía el token como token_ws en la URL
  const token_ws = searchParams.get('token_ws');
  
  // TBK_TOKEN se envía cuando hay un error o cancelación
  const tbk_token = searchParams.get('TBK_TOKEN');

  const verificarMetodo = (paymentType: string) => {
    switch (paymentType) {
      case 'VN':
        return {id: 3, name: 'Tarjeta de Débito'};
  }
}
  
  useEffect(() => {
    console.log('Token recibido:', token_ws);
    console.log('TBK_TOKEN recibido:', tbk_token);
    
    // Si hay TBK_TOKEN, significa que hubo un error o cancelación
    if (tbk_token) {
      setStatus('error');
      setMessage('El pago fue cancelado o rechazado.');
      return;
    }
    
    // Si no hay token, hay un problema
    if (!token_ws) {
      setStatus('error');
      setMessage('No se recibió token de WebPay. El pago no pudo ser procesado.');
      return;
    }

    const verifyTransaction = async () => {
      try {
        // Obtener datos guardados en localStorage
        const citaId = localStorage.getItem('idCita');
        const pacienteId = localStorage.getItem('idPaciente');
        const correo = localStorage.getItem('correo');
        const nombrePsicologo = localStorage.getItem('nombrePsicologo');
        const nombrePaciente = localStorage.getItem('nombrePaciente');
        const horaCita = localStorage.getItem('horaCita');
        const fechaCita = localStorage.getItem('fechaCita');
        const especialidad = localStorage.getItem('especialidad');
        
        console.log('Verificando transacción con token:', token_ws);
        const response = await commitTransaction(token_ws);
        console.log('Respuesta de commit:', response);
        
        // Verificamos si el pago fue exitoso
        if (response.status === 'AUTHORIZED') {
          console.log('Pago autorizado:', response);
          setTransactionDetails({
            ...response,
            payment_type: verificarMetodo(response.payment_type_code),
            citaId,
            correo: correo ? JSON.parse(correo) : null,
            nombrePsicologo: nombrePsicologo ? JSON.parse(nombrePsicologo) : null,
            pacienteId: pacienteId ? JSON.parse(pacienteId) : null,
          });
          setStatus('success');
          setMessage('¡El pago ha sido procesado exitosamente!');
          
          // Aca hacer un llamado a la API para confirmar la cita y pago
          await newAppointment({
            IdCita: Number(citaId),
            IdPaciente: pacienteId ? JSON.parse(pacienteId) : null,
            IdEstadoCita: 1, // Estado confirmado
            valor: response.amount,
            metodoPago: 3, // Medio de pago WebPay
            ordenCompra: response.buy_order || '',
            
          })
          await sendEmailConfirmation({
            emailPaciente: correo ? JSON.parse(correo) : null,
            nombrePaciente: nombrePaciente ? JSON.parse(nombrePaciente) : null,
            nombrePsicologo: nombrePsicologo ? JSON.parse(nombrePsicologo) : null,
            fechaCita: fechaCita ? JSON.parse(fechaCita) : null,
            horaCita: horaCita ? JSON.parse(horaCita) : null,
            especialidad: especialidad ? JSON.parse(especialidad) : null,
          })
          // Eliminar datos del localStorage
          localStorage.removeItem('idPaciente');
          localStorage.removeItem('correo');
          localStorage.removeItem('nombrePsicologo');
          localStorage.removeItem('nombrePaciente');
          localStorage.removeItem('horaCita');
          localStorage.removeItem('fechaCita');
          localStorage.removeItem('especialidad');
          localStorage.removeItem('idCita');
          localStorage.removeItem('idPersona');
          localStorage.removeItem('idUsuario');
        } else {
          setStatus('error');
          setMessage(`El pago no fue autorizado. Estado: ${response.status}`);
        }
      } catch (error: any) {
        console.error('Error al verificar la transacción:', error);
        setStatus('error');
        setMessage(`Error al verificar el pago: ${error.message}`);
      }
    };
    
    verifyTransaction();
  }, [token_ws, tbk_token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {status === 'processing' && (
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 p-5 mb-4">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Procesando pago</h2>
            <p className="text-gray-600">
              Estamos verificando tu pago con WebPay. Por favor espera un momento...
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-5 mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-4">
              Tu cita ha sido confirmada y pagada correctamente. En breve recibirás un email con los detalles.
            </p>
            
            {transactionDetails && (
              <div className="w-full bg-gray-50 rounded-lg p-4 text-left text-sm mb-6">
                <p><strong>Cita ID:</strong> {transactionDetails.citaId && JSON.parse(transactionDetails.citaId)}</p>
                <p><strong>Correo:</strong> {transactionDetails.correo}</p>
                <p><strong>Profesional:</strong> {transactionDetails.nombrePsicologo}</p>
                <p><strong>Orden de compra:</strong> {transactionDetails.buy_order}</p>
                <p><strong>Monto:</strong> ${transactionDetails.amount?.toLocaleString('es-CL')}</p>
                {transactionDetails.card_detail && (
                  <p><strong>Tarjeta:</strong> **** **** **** {transactionDetails.card_detail.card_number}</p>
                )}
                <p><strong>Tipo de pago:</strong> {transactionDetails.payment_type.name}</p>
                <p><strong>Cuotas:</strong> {transactionDetails.installments_number || 'Sin cuotas'}</p>
              </div>
            )}
            
            <div className="w-full space-y-3">
              <Link 
                href="/appointment/appointment"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Agendar otra cita
              </Link>
              <Link
                href="/login"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Salir
              </Link>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-red-100 p-5 mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error en el pago</h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="w-full space-y-3">
              <Link
                href="/commitpay"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Intentar nuevamente
              </Link>
              <Link
                href="/appointment/appointment"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Volver al dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}