import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../shared/services/student.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentPayment } from '../../shared/model/StudentPayment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-pay',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-pay.component.html',
  styleUrl: './edit-pay.component.scss'
})
export class EditPayComponent implements OnInit{
  activeModal = inject(NgbActiveModal);
  // Input doit recuperer l'id d'element a supprimer
  @Input() idE!: number;
  form!: FormGroup;
  eleveP!:StudentPayment;
  constructor(private studentService: StudentService,private fb: FormBuilder,private route:Router) {
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      textInput:  [''],
      amountInput: ['']
    });
    this.studentService.getPayByID(this.idE).subscribe(
      (sPay)=>{
          this.eleveP=sPay;
          this.form = this.fb.group({
            textInput:  this.eleveP.paymentReason,
            amountInput: this.eleveP.amount
          });
      }
    );
    
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.eleveP.amount=this.form.value.amountInput;
      this.eleveP.paymentReason=this.form.value.textInput;
      this.studentService.updatePayment(this.eleveP,this.eleveP.id).subscribe(
        (pay)=>{
          this.activeModal.close();
          this.route.navigateByUrl(`/dash/detail-student/${this.eleveP.register_student_id}`).then(() => {
            window.location.reload();
          });

        }
      );
      
    } 
  }
}
