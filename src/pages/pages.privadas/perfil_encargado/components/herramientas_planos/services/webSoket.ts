/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

// Define la clase WebSocketService
class WebSocketService {
  socket: Socket | null = null;

  constructor() {
    // La conexión no se realiza aquí, solo inicializamos la propiedad `socket`
    this.socket = null;
  }

  // Método para obtener el token desde localStorage
  private getToken(): string | null {
    // Obtener el objeto 'user' desde localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.token || null;  // Retorna el token si está presente
      } catch (e) {
        console.error("Error al parsear el objeto 'user' desde localStorage:", e);
        return null;
      }
    }
    
    return null; // Si no existe el objeto 'user', retornamos null
  }

  // Método para conectar al servidor WebSocket
  connect() {
    const token = this.getToken(); // Obtener el token desde localStorage

    if (!token) {
      console.error("No se encontró un token en el localStorage");
      return;
    }

    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Conectado al servidor WebSocket:', this.socket?.id);
      });

      this.socket.on('message', (msg: string) => {
        console.log('Mensaje del servidor:', msg);
      });
    } else {
      console.log('Ya estás conectado al servidor WebSocket.');
    }
  }

  // Enviar mensaje al servidor
  sendMessage(message: string, params: any) {
    if (this.socket) {
      this.socket.emit(message, { params });
    } else {
      console.error('WebSocket no está conectado');
    }
  }

  // Escuchar mensaje del servidor
  escucharMessage(message: string) {
    if (this.socket) {
      this.socket.on(message, () => {
        console.log('Respuesta del servidor :', this.socket?.id);
      });
    } else {
      console.error('WebSocket no está conectado');
    }
  }

  // Desconectar la conexión WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Desconectado del servidor WebSocket');
      this.socket = null; // Limpiar la instancia después de desconectar
    }
  }
}

export default WebSocketService;
