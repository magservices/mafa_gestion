import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../shared/services/notification.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  notifications: any[] = [];  // Pour stocker les notifications reçues
  private seenNotificationIds: Set<number> = new Set();

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.pollNotification()
  }

  pollNotification() {
    this.notificationService.pollNotifications().subscribe(
      (resNotification) => {
        const notifications = resNotification.notifications || []; // Récupérer les notifications
        notifications.forEach((res: any) => {
          // Vérifier si l'ID de la notification est déjà dans le Set
          if (res?.data?.id && !this.seenNotificationIds.has(res.data.id)) {
            this.notifications.push(res); // Ajouter la nouvelle notification
            this.seenNotificationIds.add(res.data.id); // Marquer l'ID comme vu
          }
        });

        console.log(this.notifications);
      }
    );
  }
}
