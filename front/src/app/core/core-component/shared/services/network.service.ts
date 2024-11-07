import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private isOnline = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    // Vérifier l'état de connexion au démarrage
    this.updateOnlineStatus(navigator.onLine);

    // Écouter les événements en ligne et hors ligne
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  // Retourne un observable pour le statut en ligne
  get isOnline$() {
    return this.isOnline.asObservable();
  }

  // Met à jour le statut en fonction de l'événement détecté
  private updateOnlineStatus(status: boolean) {
    this.isOnline.next(status);
  }
}
