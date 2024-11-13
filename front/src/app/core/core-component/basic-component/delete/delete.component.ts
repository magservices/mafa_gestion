import { Component, Input, OnInit,inject } from '@angular/core';
import { StudentService } from '../../shared/services/student.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Eleve } from '../../shared/model/Eleve';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent implements OnInit{
  activeModal = inject(NgbActiveModal);
  // Input doit recuperer l'id d'element a supprimer
  @Input() id!: number;

  student!: Eleve;
  loading:boolean=false;
  constructor(private studentService: StudentService, private route:Router) {
  }
  ngOnInit(): void {
    this.studentService.getStudentByID(this.id).subscribe((data) => {
      this.student = data; // Stocker les données de l'élève
    });
  }
      async deleteId() {
        this.loading=true;
        try {
          // Supprimer tous les paiements de manière asynchrone et attendre leur achèvement
          const deletePaymentPromises = this.student.registerPaymentStudent.map((payement) => 
            lastValueFrom(this.studentService.deletePay(payement.id))
          );
      
          await Promise.all(deletePaymentPromises);
      
          // Supprimer l'élève après que tous les paiements ont été supprimés
          await lastValueFrom(this.studentService.deleteEleve(this.student.id));
      
          // Fermer le modal et rediriger après la suppression réussie
          this.activeModal.close();
          this.loading=false;
          this.route.navigateByUrl('/dash/student');
        } catch (error) {
          console.error("Erreur lors de la suppression de l'élève :", error);
        }
      }
      

}
