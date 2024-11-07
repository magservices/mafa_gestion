import {Component, OnInit} from '@angular/core';
import {StudentService} from "../../shared/services/student.service";
import {StudentPayment} from "../../shared/model/StudentPayment";
import {DatePipe, DecimalPipe, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {combineLatest, debounceTime, map, startWith} from "rxjs";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-payement-page',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    SlicePipe,
    NgbPagination
  ],
  templateUrl: './payement-page.component.html',
  styleUrl: './payement-page.component.scss'
})
export class PayementPageComponent implements OnInit {
  payments: any[] = [];
  searchControl = new FormControl(); // Contrôle pour la saisie de recherche
  paymentPage: number = 5;
  pageSize = 5;
  constructor(private paymentService: StudentService) {
  }

  ngOnInit() {
    this.getAllPaymentStudent()
  }

  private getAllPaymentStudent() {
    this.paymentService.getAllPayments().subscribe(
      (resPayment) => {
        this.getStudentByID(resPayment)
      }
    )
  }


  private getStudentByID(students: StudentPayment[]) {
    students.forEach(
      (studentPayment) => {
        this.paymentService.getStudentByID(studentPayment.register_student_id).subscribe(
          (student) => {
            Object.assign(studentPayment, {student: student})
            this.payments.push(studentPayment);
          }
        )
      }
    )

    this.searchPaymentStudent(this.payments)
  }

  private searchPaymentStudent(payments: any[]) {
    const search$ = this.searchControl.valueChanges.pipe(
      map(value => value.toLowerCase())
    );

    combineLatest(
      [search$, [payments]]
    ).pipe(
      map(([search, payments]) => payments
        .filter(payment =>
          payment.student.prenom.toLowerCase().includes(search as string) ||
          payment.student.nom.toLowerCase().includes(search as string)))
    ).subscribe(
      (resPayment) => {
        this.payments = resPayment;

      }
    )
  }
}
