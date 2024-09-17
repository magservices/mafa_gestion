import {Component, OnInit} from '@angular/core';
import {StudentService} from "../../shared/services/student.service";
import {StudentPayment} from "../../shared/model/StudentPayment";
import {Eleve} from "../../shared/model/Eleve";
import {DatePipe, DecimalPipe, NgOptimizedImage, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    SlicePipe,
    NgbPaginationModule,
    NgOptimizedImage
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit {
  payments: any[] = [];
  students: Eleve[] = [];
  studentT: Eleve[] = [];
  fees: number = 0;
  amountPay: number = 0;
  paymentPage!: number;
  studentPage: number = 5;
  pageSize = 5;

  constructor(private studentService: StudentService) {
  }

  ngOnInit() {
    this.getAllPaymentStudent();
    this.getAllStudent();
  }

  private getAllPaymentStudent() {
    this.studentService.getAllPayments().subscribe(
      (resPayment) => {
        this.getStudentByID(resPayment);
        this.paymentPage = resPayment.length / this.pageSize;
        this.feesRegister(resPayment)
        this.amountAlreadyPaid(resPayment)
      }
    )
  }


  private getStudentByID(students: StudentPayment[]) {
    students.forEach(
      (studentPayment) => {
        this.studentService.getStudentByID(studentPayment.register_student_id).subscribe(
          (student) => {
            Object.assign(studentPayment, {student: student})
            this.payments.push(studentPayment);
          }
        )
      }
    )
  }

  private getAllStudent() {
    this.studentService.getAllStudent().subscribe(
      (resStudent) => {
        this.students = resStudent;
        this.transferStudent(this.students)
      }
    )
  }

  private transferStudent(students: Eleve[]) {
    students.forEach(
      (student) => {
        if (student.transfere === "oui") {
          this.studentT.push(student);
        }
      }
    )
  }

  private feesRegister(payments: StudentPayment[]) {
    payments.forEach(
      (payment)=> {
        if (payment.fees) {
          this.fees += payment.amount;
        }
      }
    )
  }

  private amountAlreadyPaid(payments: StudentPayment[]) {
    payments.forEach(
      (payment)=> {
        if (!payment.fees) {
          this.amountPay += payment.amount;
        }
      }
    )
  }



}
