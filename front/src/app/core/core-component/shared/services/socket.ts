import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = io('https://app.socket.magservices-mali.org:3000/', {

  });// Remplacez par votre domaine et port


  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  getMessages(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('message', (message: string) => {
        observer.next(message);
      });
    });
  }
}
