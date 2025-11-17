'use client'
import { useState, useEffect, useRef } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { Send, Search, MoreVertical, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { patientList } from '@/services/psicologoService';
import { PatientData } from '@/interfaces/psychologist';
import { io } from "socket.io-client";
import messageService from '@/services/messageService';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const socket = io(API_URL, { path: "/socket.io" });

interface Message {
  SenderId: number,
  ReceiverId: number,
  Mensaje: string
}

export default function MensajesPage() {
  const { userData, isLoading } = useUserData();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  // Estado para controlar la vista en móviles: true = mostrar chat, false = mostrar lista
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // cargar pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      if (!userData?.id) return;
      
      try {
        const patients = await patientList(userData?.id || 0);
        console.log('Patients fetched:', patients);
        setPatients(patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [userData?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedPatient || !userData) return;  
      if ( userData.idusuario === undefined) return;
      setLoadingMessages(true);
      try {
        const fetchedMessages = await messageService.getMessages(userData.idusuario, selectedPatient.idUsuario);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoadingMessages(false);
      } 
    };

    fetchMessages();
  }, [selectedPatient, userData]);


  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Reset de vista móvil en cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      // Si la pantalla es de escritorio (md y superior), resetear vista móvil
      if (window.innerWidth >= 768) {
        setShowChatOnMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPatient || !userData) return;
    if (!userData) return;
    if (!selectedPatient) return;
    if (!newMessage.trim()) return;

    

    socket.emit("message", {
      SenderId: userData.idusuario,
      ReceiverId: selectedPatient.idUsuario,
      Mensaje: newMessage.trim(),
    });

    setMessages(prev => [...prev, {
      SenderId: userData.idusuario!,
      ReceiverId: selectedPatient.idUsuario,
      Mensaje: newMessage.trim(),
    }]);
    setNewMessage('');
  };

   useEffect(() => {
    socket.on("message", (msg) => {
      if (!userData) return;
      console.log('Mensaje recibido:', msg);
      
      console.log('Message Receiver ID:', msg.ReceiverId);
      console.log('Message Sender ID:', msg.SenderId);
      // Verificar que el mensaje sea para este usuario o de este usuario
      if (msg.ReceiverId === userData.idusuario) {

        // Verificar que no sea un mensaje duplicado
        setMessages(prev => {
          const isDuplicate = prev.some(message => 
            message.SenderId === msg.SenderId && 
            message.ReceiverId === msg.ReceiverId &&
            message.Mensaje === msg.Mensaje &&
            Math.abs(Date.now() - new Date().getTime()) < 5000 // 5 segundos de diferencia
          );
          
          if (!isDuplicate) {
            return [...prev, {
              SenderId: msg.SenderId,
              ReceiverId: msg.ReceiverId,
              Mensaje: msg.Mensaje
            }];
          }
          return prev;
        });
      }
    });

    return () => {
      socket.off("message");
    };
  }, [userData?.id]);



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectPatient = (patient: PatientData) => {
    setSelectedPatient(patient);
    setShowChatOnMobile(true); // Mostrar chat en móvil
    
    // Enviar datos cuando se selecciona un paciente
    if (userData) {
      const patientData = {
        SenderId: userData.id,
        ReceiverId: patient.idUsuario,
        Mensaje: '', // Mensaje vacío al seleccionar
      };
      
      socket.emit("message", {
        message: patientData
      });
    }
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false); // Volver a la lista en móvil
  };

  const filteredPatients = patients.filter(patient =>
    patient.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.rut.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Lista de Psicólogos - Sidebar */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${
        showChatOnMobile ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header del sidebar */}
        <div className="p-4 pt-8 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Mensajes</h1>
          
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar psicólogos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de psicólogos */}
        <div className="flex-1 overflow-y-auto">
          {filteredPatients.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No tienes conversaciones disponibles.</p>
              <p className="text-sm mt-2">Las conversaciones aparecerán cuando tengas citas programadas.</p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.idUsuario}
                onClick={() => handleSelectPatient(patient)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedPatient?.idUsuario === patient.idUsuario
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar con indicador online */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {patient.nombreCompleto.split(' ').map(n => n[0]).join('').slice(0, 1)}
                    </div>
                    
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {patient.nombreCompleto}
                      </p>
                      
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {patient.rut}
                    </p>
                    
                  </div>

                  {/* Badge de mensajes no leídos */}
                  
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${
        showChatOnMobile ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedPatient ? (
          <>
            {/* Header del chat */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Botón de volver - solo visible en móvil */}
                <button
                  onClick={handleBackToList}
                  className="md:hidden p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {selectedPatient.nombreCompleto.split(' ').map(n => n[0]).join('').slice(0, 1)}
                  </div>
                  
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedPatient.nombreCompleto}</h2>
                  
                </div>
              </div>

              {/* Acciones del chat */}
              <div className="flex items-center space-x-2">
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.SenderId === userData?.idusuario ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.SenderId === userData?.idusuario
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.Mensaje}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.SenderId === userData?.idusuario ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Mensaje de bienvenida */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Selecciona una conversación
              </h2>
              <p className="text-gray-500 max-w-sm">
                Elige un psicólogo de la lista para comenzar a chatear y mantener comunicación entre sesiones.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}