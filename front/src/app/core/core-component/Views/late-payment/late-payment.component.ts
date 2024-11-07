import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/model/User";
import {Eleve} from "../../shared/model/Eleve";
import {NotificationService} from "../../shared/services/notification.service";
import {UserService} from "../../shared/services/user.service";
import {StudentService} from "../../shared/services/student.service";
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-late-payment',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    RouterLink
  ],
  templateUrl: './late-payment.component.html',
  styleUrls: ['./late-payment.component.scss']
})
export class LatePaymentComponent implements OnInit {

  user!: User;
  latePaymentStudent: Eleve[] = [];
  paginatedStudents: Eleve[] = [];
  currentPage = 1;
  studentsPerPage = 12;
  totalPages = 1;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private studentService: StudentService
  ) {
  }

  ngOnInit(): void {
    this.userService.getUsersByAccessKey().pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
        return of(undefined);
      })
    ).subscribe(user => {
      if (user) {
        this.user = user;
        this.getStudents(user);
      }
    });
  }

  getStudents(user: User): void {
    this.studentService.getAllStudent().pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération des étudiants', err);
        return of([]);
      })
    ).subscribe(resStudent => {
      const roleUserKeyMap: { [role: string]: string | null } = {
        "ROLE_DIRECTOR": "primary school",
        "ROLE_CENSOR": "high school",
      };

      const userKey = roleUserKeyMap[user.roles[0]] ?? null;
      const students = userKey ? resStudent.filter(student => student.userKey === userKey) : resStudent;
      this.studentArrears(students);
      this.updatePagination();
    });
  }

  studentArrears(students: Eleve[]): void {
    this.latePaymentStudent = students
      .filter(student => student.registerPaymentStudent.some(payment => payment.paymentStatus === "retard"));
    this.totalPages = Math.ceil(this.latePaymentStudent.length / this.studentsPerPage);
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.studentsPerPage;
    const end = start + this.studentsPerPage;
    this.paginatedStudents = this.latePaymentStudent.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
