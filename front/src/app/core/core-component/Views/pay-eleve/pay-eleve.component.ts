import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Eleve} from "../../shared/model/Eleve";
import {DecimalPipe, NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";
import {Router} from "@angular/router";
import {StudentPayment} from "../../shared/model/StudentPayment";

@Component({
  selector: 'app-pay-eleve',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DecimalPipe,
    ReactiveFormsModule
  ],
  templateUrl: './pay-eleve.component.html',
  styleUrl: './pay-eleve.component.scss'
})
export class PayEleveComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() componentName!: string;
  @Input() student!: Eleve;
  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private paymentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      totalAnnualCosts: [null],
      paymentReason: ['', Validators.required],
      paymentStatus: [''],
      amount: [null, Validators.required],
      month: ['Selectionnez le mois à payer', Validators.required],
    });
  }

  cancel() {
    this.activeModal.close();
  }

  onSubmit(student: Eleve): void {

    if (this.paymentForm.valid) {

      let studentPayment: StudentPayment = {
        id: 0,
        totalAnnualCosts: 0,
        amount: this.paymentForm.value.amount,
        month: this.paymentForm.value.month,
        paymentReason: this.paymentForm.value.paymentReason,
        paymentStatus: this.paymentForm.value.paymentStatus = this.paymentForm.value.paymentStatus ? "avance" : "retard",
        create_at: Date.now()
      }

      this.paymentService.createPayment(studentPayment, student.id)
        .subscribe(response => {
          if (this.componentName === "monthly payment") {
            this.activeModal.close()
          } else {
            this.router.navigateByUrl("/dash/detail-student/" + student.id);
          }
        });
    }
  }
}
