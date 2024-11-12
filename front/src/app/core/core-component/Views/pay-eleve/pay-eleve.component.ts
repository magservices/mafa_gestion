import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Eleve} from "../../shared/model/Eleve";
import {DecimalPipe, NgIf, NgOptimizedImage, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";
import {Router} from "@angular/router";
import {StudentPayment} from "../../shared/model/StudentPayment";
import {establishment} from "../../../../../environments/environment";
import {ThousandSeparatorDirectiveDirective} from "../../shared/res/directive/thousand-separator-directive.directive";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-pay-eleve',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DecimalPipe,
    ReactiveFormsModule,
    UpperCasePipe,
    TitleCasePipe,
    NgIf,
    ThousandSeparatorDirectiveDirective
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
  paidMonths: Map<string, number> = new Map(); // Correction ici
  remainingMonths: { month: string, amountRemaining: number }[] = []; // Changement ici
  loading = false;  // Variable pour suivre l'état du chargement


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
      month: ['october'],
      month_total: [null],
    });
    this.remainingMonthsToPay();
    if (this.remainingMonths.length > 0) {
      // Sélectionner le premier mois restant comme valeur par défaut
      this.paymentForm.get('month')?.setValue(this.remainingMonths[0].month);
    }
  }



  private remainingMonthsToPay() {
    // Initialiser le coût mensuel à 0
    let monthlyCost: number = 0;

    // Récupérer les mois déjà payés et les montants correspondants
    if (this.student !== undefined && this.student.registerPaymentStudent.length !== 0) {
      // Récupérer le premier paiement d'élève pour obtenir le montant total annuel
      let firstPayment = this.student.registerPaymentStudent[this.student.registerPaymentStudent.length - 1];

      if (firstPayment) {
        // Calculer le montant mensuel
        monthlyCost = firstPayment.totalAnnualCosts / 9; // Assurez-vous que le nombre de mois est correct (ici 9 mois)
      }

      // Réinitialiser la Map paidMonths
      this.paidMonths.clear();

      // Calculer les paiements déjà effectués
      this.student.registerPaymentStudent.forEach((resPayment) => {
        // Ajouter ou mettre à jour le montant payé pour chaque mois
        this.paidMonths.set(resPayment.month, (this.paidMonths.get(resPayment.month) || 0) + resPayment.amount);
      });
    }

    // Variables pour gérer les paiements supplémentaires
    let extraPayment = 0;

    // Calcul des mois restants avec les montants dus
    this.remainingMonths = this.allMonths.map(month => {
      // Calculer le montant payé pour le mois
      const amountPaid = (this.paidMonths.get(month) || 0) + extraPayment;

      // Si le paiement pour le mois dépasse le montant mensuel, masquer le mois et déduire l'excès
      if (amountPaid >= monthlyCost) {
        extraPayment = amountPaid - monthlyCost; // Stocker l'excédent pour le mois suivant
        return null; // Masquer ce mois car il est totalement payé
      } else {
        // Calculer le montant restant à payer pour le mois
        const amountRemaining = monthlyCost - amountPaid;
        extraPayment = 0; // Réinitialiser car il n'y a plus d'excédent
        return {
          month,
          amountRemaining
        };
      }
    }).filter(item => item !== null); // Filtrer les mois totalement payés (retirer les null)

  }


  async cancel() {
    if (this.student !== undefined && this.student.registerPaymentStudent.length === 0) {
      try {
        // Supprimer tous les paiements de manière asynchrone et attendre leur achèvement
        const deletePaymentPromises = this.student.registerPaymentStudent.map((payement) => 
          lastValueFrom(this.paymentService.deletePay(payement.id))
        );
    
        await Promise.all(deletePaymentPromises);
    
        // Supprimer l'élève après que tous les paiements ont été supprimés
        await lastValueFrom(this.paymentService.deleteEleve(this.student.id));
    
        // Fermer le modal et rediriger après la suppression réussie
        this.activeModal.close();
        this.router.navigateByUrl('dash/register-student');
      } catch (error) {
        console.error("Erreur lors de la suppression de l'élève :", error);
      }
    
  }else{
    this.activeModal.close();
  }
}

  private remainingToBePaid(student: Eleve, newAmount: number): void {
    // Vérifier si le tableau contient au moins un élément
    if (student.registerPaymentStudent && student.registerPaymentStudent.length > 0) {
      // Récupérer le dernier paiement dans le tableau
      const lastPayment = student.registerPaymentStudent[0];

      // Calculer le montant restant par rapport au nouveau montant payé
      this.remainingTotal = lastPayment.totalAnnualCosts - newAmount;
    } else {
      // Si aucun paiement n'existe, on utilise une valeur par défaut pour le totalAnnualCosts
     // console.error("Aucun paiement enregistré pour cet élève");
      this.remainingTotal = 0; // ou une autre valeur par défaut
    }
  }

  
  
  
  updatePaymentStatus(student: Eleve, currentMonth: string, amountPaid: number): string {
    // Vérifier que le coût total annuel est bien défini pour l'élève
    const lastPayment = student.registerPaymentStudent[student.registerPaymentStudent.length - 1];
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
    this.loading = true;  // Variable pour suivre l'état du chargement

    this.remainingToBePaid(student, this.paymentForm.value.amount);
    this.updatePaymentStatus(student, this.paymentForm.value.month, this.paymentForm.value.amount);
    if (this.paymentForm.valid) {
      let studentPayment: any = {
        id: 0,
        totalAnnualCosts: this.paymentForm.value.totalAnnualCosts !== null ? this.paymentForm.value.totalAnnualCosts : this.remainingTotal,
        amount: this.paymentForm.value.amount,
        month: this.paymentForm.value.month,
        month_total: this.paymentForm.value.month_total,
        fees: this.componentName === "first payment",
        paymentReason: this.paymentForm.value.paymentReason,
        establishment: establishment.key,
        paymentStatus: this.componentName === "first payment" ? "normal" : this.updatePaymentStatus(student, this.paymentForm.value.month, this.paymentForm.value.amount)
      }

      this.paymentService.createPayment(studentPayment, student.id)
        .subscribe(response => {
          this.loading = false;  // Variable pour suivre l'état du chargement
          if (this.componentName === "monthly payment") {
            this.activeModal.close()
            window.location.reload()
          } else {
            this.activeModal.close()
            this.router.navigateByUrl("dash/student").then(
              () => {
                window.location.reload()
              }
            )
          }
        });
    }
  }
}
