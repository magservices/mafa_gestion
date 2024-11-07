import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {establishment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `https://socket.magservices-mali.org/api/notifications/${establishment.key}`;

  constructor(private http: HttpClient) { }

  // Fonction pour récupérer les notifications
  getNotifications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Fonction pour interroger le serveur toutes les 5 secondes
  pollNotifications(): Observable<any> {
    return interval(5000).pipe(
      switchMap(() => this.getNotifications())
    );
  }
}
