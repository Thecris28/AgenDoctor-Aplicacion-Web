'use client'
import { useState, useEffect, useRef } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { getChat, getPatientAppointments } from '@/services/patientService';
import { PatientAppointment } from '@/interfaces/patient';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';



interface Psychologist {
  IdUsuario: number;
  Nombre: string;
  PsicologoIdPsicologo: number;
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

// Interface para mensajes de Socket.io
interface SocketMessage {
  SenderId: number;
  ReceiverId: number;
  Mensaje: string;
  timestamp?: string;
  id?: number;
}

export default function MensajesPage() {
  const { userData, isLoading } = useUserData();
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<{[key: string]: Message[]}>({});
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const {user} = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('User Data in MensajesPage:', user?.idUsuario);
  console.log('User Data in MensajesPage:', userData);

  // Configuración de Socket.io
  useEffect(() => {
    if (!userData?.id) return;

    // Crear conexión Socket.io
    const newSocket = io("http://10.204.127.153:3000", { 
      path: "/socket.io",
      transports: ['websocket', 'polling'],
      query: {
        userId: userData.id.toString(),
        userType: 'patient' // Identificar como paciente
      }
    });

    // Eventos de conexión
    newSocket.on('connect', () => {
      console.log('Conectado al servidor Socket.io');
      setConnectionStatus('connected');
      
      // Unirse a la sala personal del usuario
      newSocket.emit('join_room', `user_${userData.id}`);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor Socket.io');
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión Socket.io:', error);
      setConnectionStatus('disconnected');
    });

    // Escuchar mensajes entrantes
    newSocket.on('message', (socketMessage: SocketMessage) => {
      console.log('Mensaje recibido:', socketMessage);
      
      // Solo procesar si el mensaje es para este usuario o de este usuario
      if (socketMessage.ReceiverId === userData.id || socketMessage.SenderId === userData.id) {
        
        // Convertir mensaje de socket a formato local
        const message: Message = {
          id: socketMessage.id || Date.now(),
          senderId: socketMessage.SenderId,
          receiverId: socketMessage.ReceiverId,
          content: socketMessage.Mensaje,
          timestamp: socketMessage.timestamp || new Date().toISOString(),
          type: 'text',
          isRead: socketMessage.SenderId !== userData.id
        };

        // Determinar el ID del otro usuario en la conversación
        const otherUserId = socketMessage.SenderId === userData.id ? socketMessage.ReceiverId : socketMessage.SenderId;
        const conversationKey = `${Math.min(userData.id, otherUserId)}-${Math.max(userData.id, otherUserId)}`;

        // Agregar mensaje a la conversación específica
        setAllMessages(prev => {
          const currentMessages = prev[conversationKey] || [];
          
          // Verificar duplicados
          const isDuplicate = currentMessages.some(msg => 
            msg.senderId === socketMessage.SenderId && 
            msg.receiverId === socketMessage.ReceiverId &&
            msg.content === socketMessage.Mensaje &&
            Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
          );
          
          if (!isDuplicate) {
            return {
              ...prev,
              [conversationKey]: [...currentMessages, message]
            };
          }
          return prev;
        });

        // Actualizar mensajes actuales SOLO si es la conversación seleccionada actualmente
        if (selectedPsychologist && 
            (selectedPsychologist.IdUsuario === otherUserId)) {
          setMessages(prev => {
            const isDuplicate = prev.some(msg => 
              msg.senderId === socketMessage.SenderId && 
              msg.receiverId === socketMessage.ReceiverId &&
              msg.content === socketMessage.Mensaje &&
              Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
            );
            
            return isDuplicate ? prev : [...prev, message];
          });
        }
        
        // Actualizar último mensaje en la lista de psicólogos
        if (socketMessage.SenderId !== userData.id) {
          setPsychologists(prev => prev.map(psych => 
            psych.IdUsuario === socketMessage.SenderId 
              ? {
                  ...psych,
                  lastMessage: socketMessage.Mensaje,
                  lastMessageTime: formatTime(message.timestamp),
                  unreadCount: (psych.unreadCount || 0) + 1
                }
              : psych
          ));
        }
      }
    });

    // Escuchar estado de usuarios online
    newSocket.on('user_online', (userId: number) => {
      setPsychologists(prev => prev.map(psych => 
        psych.IdUsuario === userId ? { ...psych, isOnline: true } : psych
      ));
    });

    newSocket.on('user_offline', (userId: number) => {
      setPsychologists(prev => prev.map(psych => 
        psych.IdUsuario === userId ? { ...psych, isOnline: false } : psych
      ));
    });

    // Escuchar confirmación de mensaje leído
    newSocket.on('message_read', (messageId: number) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    });

    setSocket(newSocket);

    // Cleanup al desmontar
    return () => {
      newSocket.disconnect();
    };
  }, [userData?.id, selectedPsychologist]);

  // Cargar psicólogos con los que ha tenido citas
  useEffect(() => {
    const fetchPsychologists = async () => {
      if (!userData?.idPaciente) return;
      
      try {
        const data: Psychologist[] = await getChat(2, userData.idPaciente);
        console.log('Datos de chat obtenidos:', data);
        setPsychologists(data);

        // Solicitar estado online de los psicólogos
        if (socket) {
          data.forEach(psych => {
            socket.emit('check_user_status', psych.IdUsuario);
          });
        }
      } catch (error) {
        console.error('Error fetching psychologists:', error);
      }
    };

    fetchPsychologists();
  }, [userData?.idPaciente, socket]);

  // Cargar historial de mensajes para el psicólogo seleccionado
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!selectedPsychologist || !userData?.id || !socket) return;

      setLoadingMessages(true);
      
      try {
        // Solicitar historial de chat al servidor
        socket.emit('load_chat_history', {
          userId: userData.id,
          otherUserId: selectedPsychologist.IdUsuario,
          limit: 50 // Cargar últimos 50 mensajes
        });

        // Escuchar respuesta del historial
        socket.once('chat_history', (history: SocketMessage[]) => {
          const formattedMessages: Message[] = history.map((msg, index) => ({
            id: msg.id || index,
            senderId: msg.SenderId,
            receiverId: msg.ReceiverId,
            content: msg.Mensaje,
            timestamp: msg.timestamp || new Date().toISOString(),
            type: 'text',
            isRead: true // Historial se considera leído
          }));

          setMessages(formattedMessages);
          setLoadingMessages(false);
        });

        // Marcar mensajes como leídos
        setPsychologists(prev => prev.map(psych => 
          psych.IdUsuario === selectedPsychologist.IdUsuario 
            ? { ...psych, unreadCount: 0 }
            : psych
        ));

        // Timeout en caso de no respuesta
        setTimeout(() => {
          setLoadingMessages(false);
        }, 5000);

      } catch (error) {
        console.error('Error loading chat history:', error);
        setLoadingMessages(false);
      }
    };

    loadChatHistory();
  }, [selectedPsychologist, userData?.id, socket]);

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset de vista móvil en cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowChatOnMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPsychologist || !userData || !socket) return;

    const messageData: SocketMessage = {
      SenderId: userData.id,
      ReceiverId: selectedPsychologist.IdUsuario,
      Mensaje: newMessage.trim(),
      
    };

    // Enviar mensaje via socket
    socket.emit('message', {
      ...messageData
    });

    // Limpiar el input inmediatamente para mejor UX
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
    setShowChatOnMobile(true);
    
    // Cargar mensajes de esta conversación específica
    if (userData?.id) {
      const conversationKey = `${Math.min(userData.id, psychologist.IdUsuario)}-${Math.max(userData.id, psychologist.IdUsuario)}`;
      const conversationMessages = allMessages[conversationKey] || [];
      setMessages(conversationMessages);
      
      // Marcar mensajes como leídos
      setPsychologists(prev => prev.map(psych => 
        psych.IdUsuario === psychologist.IdUsuario 
          ? { ...psych, unreadCount: 0 }
          : psych
      ));
    }
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  const filteredPsychologists = psychologists.filter(psych =>
    psych.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Mensajes</h1>
            {/* Indicador de conexión */}
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} title={`Estado: ${connectionStatus}`}></div>
          </div>
          
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
                key={psychologist.IdUsuario}
                onClick={() => handleSelectPsychologist(psychologist)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedPsychologist?.IdUsuario === psychologist.IdUsuario
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar con indicador online */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {psychologist.Nombre.split(' ').map(n => n[0]).join('').slice(0, 1)}
                    </div>
                    {psychologist.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {psychologist.Nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {psychologist.lastMessageTime}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {psychologist.especialidad}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {psychologist.lastMessage || 'No hay mensajes aún'}
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
                    {selectedPsychologist.Nombre.split(' ').map(n => n[0]).join('').slice(0, 1)}
                  </div>
                  {selectedPsychologist.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedPsychologist.Nombre}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedPsychologist.isOnline ? 'En línea' : 'Desconectado'} • {selectedPsychologist.especialidad}
                  </p>
                </div>
              </div>

              {/* Acciones del chat */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5" />
                </button>
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
                  <p className="ml-2 text-gray-600">Cargando mensajes...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay mensajes aún</p>
                    <p className="text-sm">Escribe el primer mensaje para comenzar la conversación</p>
                  </div>
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
                      <div className={`flex items-center justify-between text-xs mt-1 ${
                        message.senderId === userData?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === userData?.id && (
                          <span className="ml-2">
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="bg-white border-t border-gray-200 p-4">
              {connectionStatus !== 'connected' && (
                <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
                  Conexión {connectionStatus}. Los mensajes se enviarán cuando se restablezca la conexión.
                </div>
              )}
              
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
                    disabled={connectionStatus !== 'connected'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || connectionStatus !== 'connected'}
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
              {connectionStatus !== 'connected' && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
                  Estado de conexión: {connectionStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}