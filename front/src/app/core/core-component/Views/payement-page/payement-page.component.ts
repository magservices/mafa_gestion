import {Component, OnInit} from '@angular/core';
import {StudentService} from "../../shared/services/student.service";
import {StudentPayment} from "../../shared/model/StudentPayment";
import {DatePipe, DecimalPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-payement-page',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './payement-page.component.html',
  styleUrl: './payement-page.component.scss'
})
export class PayementPageComponent implements OnInit {
  payments : any[] = [];
  constructor(private paymentService: StudentService) {
  }

  ngOnInit() {
    this.getAllPaymentStudent()
  }

  private getAllPaymentStudent() {
    this.paymentService.getAllPayments().subscribe(
      (resPayment)=> {
        this.getStudentByID(resPayment)
      }
    )
  }

  private getStudentByID(students: StudentPayment[]) {
    students.forEach(
      (studentPayment)=> {
        this.paymentService.getStudentByID(studentPayment.register_student_id).subscribe(
          (student)=> {
            Object.assign(studentPayment, {student : student})
            this.payments.push(studentPayment);
          }
        )
      }
    )
  }
}
