import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../shared/services/notification.service";
import {RouterLink} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/model/User";
import {StudentService} from "../../shared/services/student.service";
import {Eleve} from "../../shared/model/Eleve";

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
  user!: User;
  latePaymentStudent: Eleve[] = [];

  constructor(private notificationService: NotificationService,
              private userService: UserService,
              private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.pollNotification()
    this.userService.getUsersByAccessKey().subscribe(
      (user) => {
        if (user !== undefined) {
          this.user = user
          this.getStudents(user)
        }
      }
    )
  }

  pollNotification() {
    this.notificationService.pollNotifications().subscribe(
      (resNotification) => {
        const notifications = resNotification.notifications || []; // Récupérer les notifications
        notifications.forEach((res: any) => {
          // Vérifier si l'ID de la notification ou register_student_id est déjà dans le Set
          if ((res?.data?.id || res?.data?.register_student_id) &&
            !this.seenNotificationIds.has(res.data.id || res.data.register_student_id)) {

            this.notifications.push(res); // Ajouter la nouvelle notification

            // Utiliser l'ID ou register_student_id pour marquer l'ID comme vu
            const notificationId = res.data.id !== 0 ? res.data.id : res.data.register_student_id;

            this.seenNotificationIds.add(notificationId); // Marquer l'ID comme vu
          }
        });
      }
    );
  }

  // des élèves en retard de paiement
  getStudents(user: User) {
    this.studentService.getAllStudent().subscribe(
      (resStudent) => {
        // Mapping des rôles aux valeurs userKey correspondantes
        const roleUserKeyMap: { [role: string]: string | null } = {
          "ROLE_DIRECTOR": "primary school",
          "ROLE_CENSOR": "high school",
        };

        const userRole = user.roles[0];
        const userKey = roleUserKeyMap[userRole];

        // Filtrer en fonction du rôle ou retourner tous les étudiants
        let students;

        if (userRole === "ROLE_DIRECTOR") {
          // Cas spécifique pour le directeur : inclure 'high school' + 'transfere == prive'
          const students1 = resStudent.filter(student => 
            (student.userKey === 'high school' && student.transfere === 'Privé')
          );
          students = resStudent.filter(student => 
            (student.userKey === 'primary school')
          );
          students.push(...students1);
  
        } else {
          students = userKey ? resStudent.filter(student => student.userKey === userKey) : resStudent;
        } 
        this.studentArrears(students) 
      }
    )
  }

  // Ajouter les étudiants ayant au moins un paiement en retard à la liste `latePaymentStudent`, limitée à 12 éléments
  studentArrears(students: Eleve[]) {
    this.latePaymentStudent = students
      .filter(student => student.registerPaymentStudent.some(payment => payment.paymentStatus === "retard"))
      .slice(0, 12);
  }
}
