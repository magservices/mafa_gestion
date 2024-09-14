import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Eleve} from "../../shared/model/Eleve";
import {DecimalPipe, NgOptimizedImage, UpperCasePipe} from "@angular/common";
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
    ReactiveFormsModule,
    UpperCasePipe
  ],
  templateUrl: './pay-eleve.component.html',
  styleUrl: './pay-eleve.component.scss'
})
export class PayEleveComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() componentName!: string;
  @Input() student!: Eleve;
  paymentForm!: FormGroup;
  allMonths: string[] = ['octobre', 'novembre', 'decembre', 'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin'];
  paidMonths: string[] = []; // Remplir cette liste avec les mois déjà payés
  remainingMonths: string[] = [];

  remainingTotal!: number;

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
    this.remainingMonthsToPay();
  }

  private remainingMonthsToPay() {

    // on recupere les mois deja paye
    if (this.student !== undefined && this.student.registerPaymentStudent.length !== 0) {
      this.student.registerPaymentStudent.forEach(
        (resPayment)=> {
          this.paidMonths.push(resPayment.month);
        }
      )
    }

    // Calcul des mois restants
    this.remainingMonths = this.allMonths.filter(month => !this.paidMonths.includes(month));
  }

  cancel() {
    this.activeModal.close();
  }

  private remainingToBePaid(student: Eleve, newAmount: number): void {
    // Vérifier si le tableau contient au moins un élément
    if (student.registerPaymentStudent && student.registerPaymentStudent.length > 0) {
      // Récupérer le dernier paiement dans le tableau
      const lastPayment = student.registerPaymentStudent[student.registerPaymentStudent.length - 1];

      // Calculer le montant restant par rapport au nouveau montant payé
      this.remainingTotal = lastPayment.totalAnnualCosts - newAmount;
    } else {
      // Si aucun paiement n'existe, on utilise une valeur par défaut pour le totalAnnualCosts
      console.error("Aucun paiement enregistré pour cet élève");
      this.remainingTotal = 0; // ou une autre valeur par défaut
    }
  }

  updatePaymentStatus(student: Eleve, currentMonth: string, amountPaid: number): string {
    // Vérifier que le coût total annuel est bien défini pour l'élève
    const lastPayment = student.registerPaymentStudent[student.registerPaymentStudent.length - 1];
    const totalAnnualCosts = lastPayment?.totalAnnualCosts || 0;

    if (totalAnnualCosts === 0) {
      console.error("Le coût annuel total n'est pas défini pour cet élève.");
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

    // Calcul du montant total attendu jusqu'au mois courant
    const expectedPayment = selectedMonthIndex * monthlyCost;

    // Calcul du total payé par l'élève jusqu'à présent
    // Inclure le montant payé dans le paiement actuel
    const totalPaid = student.registerPaymentStudent.reduce((acc, payment) => acc + payment.amount, 0) + amountPaid;

    // Comparer le montant payé avec le montant attendu
    let paymentStatus = '';
    if (totalPaid > expectedPayment) {
      paymentStatus = 'avance'; // L'élève a payé plus que ce qu'il devait jusqu'à maintenant
    } else if (totalPaid < expectedPayment) {
      paymentStatus = 'retard'; // L'élève est en retard
    } else {
      paymentStatus = 'normal'; // L'élève est à jour
    }

    // Mettre à jour le statut de paiement dans chaque enregistrement
    student.registerPaymentStudent.forEach(payment => {
      payment.paymentStatus = paymentStatus;
    });

    // Optionnel : Afficher le statut de paiement dans la console
    return paymentStatus;
  }


  onSubmit(student: Eleve): void {
    this.remainingToBePaid(student, this.paymentForm.value.amount);
    this.updatePaymentStatus(student, this.paymentForm.value.month, this.paymentForm.value.amount);
    if (this.paymentForm.valid) {
      let studentPayment: StudentPayment = {
        id: 0,
        totalAnnualCosts: this.paymentForm.value.totalAnnualCosts !== null ? this.paymentForm.value.totalAnnualCosts : this.remainingTotal,
        amount: this.paymentForm.value.amount,
        month: this.paymentForm.value.month,
        fees: this.componentName === "first payment",
        paymentReason: this.paymentForm.value.paymentReason,
        paymentStatus: this.componentName === "first payment" ? "normal" : this.updatePaymentStatus(student, this.paymentForm.value.month, this.paymentForm.value.amount)
      }

      console.log(studentPayment)


      // this.paymentService.createPayment(studentPayment, student.id)
      //   .subscribe(response => {
      //     if (this.componentName === "monthly payment") {
      //       this.activeModal.close()
      //       window.location.reload()
      //     } else {
      //       this.activeModal.close()
      //       this.router.navigateByUrl("/dash/detail-student/" + student.id);
      //     }
      //   });
    }
  }
}
