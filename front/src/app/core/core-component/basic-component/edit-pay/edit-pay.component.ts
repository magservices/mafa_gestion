import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../shared/services/student.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentPayment } from '../../shared/model/StudentPayment';
import { Router } from '@angular/router';
import { Eleve } from '../../shared/model/Eleve';

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
  @Input() elevePay!:StudentPayment[];
  @Input() mois!:string;
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
      this.eleveP.paymentStatus=this.updatePaymentStatus(this.elevePay,this.mois,this.eleveP.amount)
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




  updatePaymentStatus(registerPaymentStudent: StudentPayment[], currentMonth: string, amountPaid: number): string {
    // Vérifier que le coût total annuel est bien défini pour l'élève
    const lastPayment = registerPaymentStudent[registerPaymentStudent.length - 1];
    const totalAnnualCosts = lastPayment?.totalAnnualCosts || 0;
    
    if (totalAnnualCosts === 0) {
    //  console.error("Le coût annuel total n'est pas défini pour cet élève.");
      return '';
    }

    // Calcul du montant à payer chaque mois en fonction du montant annuel
    const monthlyCost = totalAnnualCosts / 9; // Diviser le montant annuel par le nombre de mois (9)

    // Convertir le mois en cours sélectionné en un index de mois (1 à 9)
    const monthMap: { [key: string]: number } = {
      'octobre': 1, 'novembre': 2, 'decembre': 3,
      'janvier': 4, 'fevrier': 5, 'mars': 6,
      'avril': 7, 'mai': 8, 'juin': 9
    };

    
    const selectedMonthIndex = monthMap[currentMonth] || 0;

    if (selectedMonthIndex === 0) {
      console.error("Mois sélectionné invalide.");
      return '';
    }

    const expectedPayment = selectedMonthIndex * monthlyCost;
    let totalPaid = registerPaymentStudent.reduce((acc, payment) => acc + payment.amount, 0) + amountPaid;
    totalPaid-=registerPaymentStudent[0].amount+registerPaymentStudent[registerPaymentStudent.length-1].amount;

    let paymentStatus = '';
    if (totalPaid > expectedPayment) {
      paymentStatus = 'avance'; // L'élève a payé plus que ce qu'il devait jusqu'à maintenant
    } else if (totalPaid < expectedPayment) {
      paymentStatus = 'retard'; // L'élève est en retard
    } else {
      paymentStatus = 'normal'; // L'élève est à jour
    }

    return paymentStatus;
  }
}
