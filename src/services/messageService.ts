import { io, Socket } from 'socket.io-client';

export interface Message {
  IdMensaje: number;
  SenderId: number;
  ReceiverId: number;
  Mensaje: string;
  Timestamp: string;
  senderName?: string;
}

export interface Contact {
  id: number;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

class MessageService {
  private socket: Socket | null = null;
  private baseUrl = API_URL;

  // Inicializar conexión socket
  initSocket(): Socket {
    if (!this.socket) {
      this.socket = io(API_URL, {
        path: "/socket.io",
        transports: ['websocket', 'polling']
      });
    }
    return this.socket;
  }


  // Obtener mensajes entre dos usuarios
  async getMessages(senderId: number, receiverId: number): Promise<Message[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/messages?SenderId=${senderId}&ReceiverId=${receiverId}`
      );
      
      if (!response.ok) {
        throw new Error('Error fetching messages');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Enviar mensaje
  sendMessage(senderId: number, receiverId: number, mensaje: string): void {
    if (this.socket) {
      this.socket.emit('message', {
        SenderId: senderId,
        ReceiverId: receiverId,
        Mensaje: mensaje
      });
    }
  }

  // Obtener lista de contactos (usuarios con los que se ha conversado)
  async getContacts(userId: number): Promise<Contact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Error fetching contacts');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting contacts:', error);
      // Fallback con datos mock si no existe la ruta
      return this.getMockContacts(userId);
    }
  }

  // Obtener todos los usuarios disponibles
  async getUsers(currentUserId: number): Promise<Contact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users?currentUserId=${currentUserId}`);
      
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Buscar usuarios por nombre
  async searchUsers(query: string, currentUserId: number): Promise<Contact[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/search?query=${encodeURIComponent(query)}&currentUserId=${currentUserId}`
      );
      
      if (!response.ok) {
        throw new Error('Error searching users');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Marcar mensajes como leídos
  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/mark-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, receiverId })
      });
      
      if (!response.ok) {
        throw new Error('Error marking messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Mock de contactos para desarrollo
  private getMockContacts(currentUserId: number): Contact[] {
    const mockUsers = [
      { id: 1, name: 'Dr. Juan Pérez' },
      { id: 2, name: 'Dra. María González' },
      { id: 3, name: 'Dr. Carlos López' },
      { id: 4, name: 'Dra. Ana Martínez' },
      { id: 5, name: 'Dr. Luis Rodríguez' },
    ];

    return mockUsers
      .filter(user => user.id !== currentUserId)
      .map(user => ({
        ...user,
        lastMessage: 'Último mensaje...',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      }));
  }

  // Configurar listeners de socket
  onMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  // Remover listeners
  offMessage(): void {
    if (this.socket) {
      this.socket.off('message');
    }
  }

  // Desconectar socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Unirse a una sala de chat (opcional para chats privados)
  joinRoom(userId: number, receiverId: number): void {
    if (this.socket) {
      const roomId = [userId, receiverId].sort().join('-');
      this.socket.emit('join-room', roomId);
    }
  }

  // Salir de una sala de chat
  leaveRoom(userId: number, receiverId: number): void {
    if (this.socket) {
      const roomId = [userId, receiverId].sort().join('-');
      this.socket.emit('leave-room', roomId);
    }
  }
}

// Instancia singleton
export const messageService = new MessageService();
export default messageService;