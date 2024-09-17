import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from "../../../../../environments/environment";
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'] // Assure que le client utilise WebSocket
    });
  }

  // Méthode pour recevoir les notifications
  onNotification() {
    return new Observable(observer => {
      this.socket.on('notification', (data: any) => {
        observer.next(data);
      });
    });
  }
}
