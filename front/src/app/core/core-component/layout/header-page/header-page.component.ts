import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NotificationService} from "../../shared/services/notification.service";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../basic-component/alert/alert.component";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/model/User";

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss'
})
export class HeaderPageComponent implements OnInit {
  today: Date = new Date(); // Obtenir la date actuelle
  notification!: any;  // Pour stocker les notifications reçues
  private seenNotificationIds: Set<number> = new Set();
  private modalService = inject(NgbModal);

  user : User=new User();

  constructor(private notificationService: NotificationService,
              private userService: UserService) {
  }

  ngOnInit(): void {

    this.userService.getUsersByAccessKey().subscribe(
      (user) => {
        if (user !== undefined) {
          this.user = user;
          if (user.roles[0] === "ROLE_ADMIN") {
            setInterval(() => {
              this.today = new Date();
            }, 1000); // 1000 ms = 1 seconde
            this.pollNotification()
          }
        }
      }
    )
  }

  pollNotification() {
    this.notificationService.pollNotifications().subscribe(
      (resNotification) => {
        const notifications = resNotification.notifications || []; // Récupérer les notifications

        // Parcourir les notifications reçues
        for (let res of notifications) {
          // Vérifier si l'ID ou register_student_id de la notification est déjà dans le Set
          const notificationId = res?.data?.id || res?.data?.register_student_id;

          if (notificationId && !this.seenNotificationIds.has(notificationId)) {
            // Marquer l'ID comme vu
            this.seenNotificationIds.add(notificationId);

            // Stocker et afficher uniquement la nouvelle notification
            this.notification = res;

            console.log('Nouvelle notification :', res);

            // Arrêter la boucle une fois qu'une nouvelle notification est trouvée
            return; // Sortir de la méthode dès qu'une nouvelle notification est traitée
          }
        }

      }
    );
  }

  logout(): void {
    const modalRef = this.modalService.open(AlertComponent,
      {size: "lg", animation: true, centered: true});
    modalRef.componentInstance.componentName = "logout";

  }


}
