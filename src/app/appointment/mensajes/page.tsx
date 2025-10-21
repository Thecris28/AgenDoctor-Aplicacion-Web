'use client'
import { useState, useEffect, useRef } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { getPatientAppointments } from '@/services/patientService';
import { PatientAppointment } from '@/interfaces/patient';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft } from 'lucide-react';

interface Psychologist {
  id: number;
  nombre: string;
  especialidad: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
}

export default function MensajesPage() {
  const { userData, isLoading } = useUserData();
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  // Estado para controlar la vista en móviles: true = mostrar chat, false = mostrar lista
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar psicólogos con los que ha tenido citas
  useEffect(() => {
    const fetchPsychologists = async () => {
      if (!userData?.idPaciente) return;
      
      try {
        const appointments = await getPatientAppointments(userData.idPaciente);
        
        // Extraer psicólogos únicos de las citas
        const uniquePsychologists = appointments.reduce((acc: Psychologist[], appointment: PatientAppointment) => {
          const existingPsych = acc.find(p => p.nombre === appointment.nombre_psicologo);
          if (!existingPsych) {
            acc.push({
              id: appointment.IdUsuario, // Usar el ID del usuario del psicólogo
              nombre: appointment.nombre_psicologo,
              especialidad: appointment.especialidad,
              avatar: `/api/placeholder/40/40`, // Placeholder avatar
              lastMessage: 'Hola, ¿cómo te sientes después de nuestra última sesión?',
              lastMessageTime: '14:30',
              unreadCount: Math.floor(Math.random() * 3), // Simulado
              isOnline: Math.random() > 0.5, // Simulado
            });
          }
          return acc;
        }, []);
        
        setPsychologists(uniquePsychologists);
      } catch (error) {
        console.error('Error fetching psychologists:', error);
      }
    };

    fetchPsychologists();
  }, [userData?.idPaciente]);

  // Simular carga de mensajes para el psicólogo seleccionado
  useEffect(() => {
    if (selectedPsychologist) {
      setLoadingMessages(true);
      // Simular delay de carga
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: 1,
            senderId: selectedPsychologist.id,
            receiverId: userData?.id || 0,
            content: 'Hola, ¿cómo has estado desde nuestra última sesión?',
            timestamp: '2024-10-19T10:00:00Z',
            type: 'text',
            isRead: true,
          },
          {
            id: 2,
            senderId: userData?.id || 0,
            receiverId: selectedPsychologist.id,
            content: 'Hola doctor, he estado practicando los ejercicios que me recomendó.',
            timestamp: '2024-10-19T10:05:00Z',
            type: 'text',
            isRead: true,
          },
          {
            id: 3,
            senderId: selectedPsychologist.id,
            receiverId: userData?.id || 0,
            content: 'Excelente, me alegra escuchar eso. ¿Has notado alguna mejora en tu estado de ánimo?',
            timestamp: '2024-10-19T10:10:00Z',
            type: 'text',
            isRead: true,
          },
          {
            id: 4,
            senderId: userData?.id || 0,
            receiverId: selectedPsychologist.id,
            content: 'Sí, definitivamente me siento más tranquilo. Los ejercicios de respiración me han ayudado mucho.',
            timestamp: '2024-10-19T10:15:00Z',
            type: 'text',
            isRead: false,
          },
        ];
        setMessages(mockMessages);
        setLoadingMessages(false);
      }, 500);
    }
  }, [selectedPsychologist, userData?.id]);

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
    if (!newMessage.trim() || !selectedPsychologist || !userData) return;

    const message: Message = {
      id: messages.length + 1,
      senderId: userData.id,
      receiverId: selectedPsychologist.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectPsychologist = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
    setShowChatOnMobile(true); // Mostrar chat en móvil
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false); // Volver a la lista en móvil
  };

  const filteredPsychologists = psychologists.filter(psych =>
    psych.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    psych.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          {filteredPsychologists.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No tienes conversaciones disponibles.</p>
              <p className="text-sm mt-2">Las conversaciones aparecerán cuando tengas citas programadas.</p>
            </div>
          ) : (
            filteredPsychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                onClick={() => handleSelectPsychologist(psychologist)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedPsychologist?.id === psychologist.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar con indicador online */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {psychologist.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    {psychologist.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {psychologist.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {psychologist.lastMessageTime}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {psychologist.especialidad}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {psychologist.lastMessage}
                    </p>
                  </div>

                  {/* Badge de mensajes no leídos */}
                  {psychologist.unreadCount && psychologist.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {psychologist.unreadCount}
                    </div>
                  )}
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
        {selectedPsychologist ? (
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
                    {selectedPsychologist.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {selectedPsychologist.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedPsychologist.nombre}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedPsychologist.isOnline ? 'En línea' : 'Desconectado'} • {selectedPsychologist.especialidad}
                  </p>
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
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === userData?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === userData?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === userData?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
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