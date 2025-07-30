import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
// https://salama-pmmp.onrender.com
  connect() {
    if (!this.socket) {
      this.socket = io('https://salama-pmmp.onrender.com');
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();