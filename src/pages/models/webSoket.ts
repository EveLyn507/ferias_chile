/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

// Define la clase WebSocketService
class userWebSocketService {
  private static instance: userWebSocketService | null = null;  // Instancia estática para el singleton
  socket: Socket | null = null;

  private constructor() {
    // Inicializar la propiedad socket, pero no realizar la conexión aún
    this.socket = null;
  }

  // Método para obtener la instancia del singleton
  public static getInstance(): userWebSocketService {
    if (!userWebSocketService.instance) {
      userWebSocketService.instance = new userWebSocketService();
    }
    return userWebSocketService.instance;
  }

  // Método para obtener el token desde localStorage
  private getToken(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.token || null;
      } catch (e) {
        console.error("Error al parsear el objeto 'user' desde localStorage:", e);
        return null;
      }
    }
    return null;
  }

  // Método para conectar al servidor WebSocket
  connect() {
    const token = this.getToken();

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

  RecibeData(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error("Socket no está conectado.");
    }
  }

  // Desconectar la conexión WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Desconectado del servidor WebSocket');
      this.socket = null;
    }
  }
}

export default userWebSocketService;
