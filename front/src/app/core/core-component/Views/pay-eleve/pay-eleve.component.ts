import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Eleve} from "../../shared/model/Eleve";
import {DecimalPipe, NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";

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

  constructor(private fb: FormBuilder, private paymentService: StudentService) {
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

  onSubmit(student: Eleve): void {
    if (this.paymentForm.valid) {
      // this.paymentService.createPayment(this.paymentForm.value, student.id)
      //   .subscribe(response => {
      //     console.log('Paiement créé avec succès', response);
      //   });

      console.log(student.id)
      console.log(this.paymentForm.value)
    }
  }
}
