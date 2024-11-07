import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EstablishmentService} from "../../shared/services/establishment.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-school-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './school-new.component.html',
  styleUrl: './school-new.component.scss'
})
export class SchoolNewComponent implements OnInit{
  establishmentForm!: FormGroup;
  loading : boolean = false;
  activeModal = inject(NgbActiveModal);

  constructor(
    private formBuilder: FormBuilder,
    private establishmentService: EstablishmentService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Initialisation du formulaire avec tous les champs
    this.establishmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-8]{8}$')]], // Validation d'un numéro de téléphone à 10 chiffres
      subscriptionType: ['', Validators.required],
      modalType: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]], // Le prix doit être supérieur à 0
      month: [0, [Validators.required, Validators.min(0)]],  // Le nombre de mois doit être au moins 1
      createAt: [new Date(), Validators.required], // Date actuelle par défaut
      expiryDate: ['', Validators.required] // Date d'expiration obligatoire
    });
  }

  onSubmit(): void {
    this.loading = true;
    if (this.establishmentForm.valid) {
      const establishmentData = {
        ...this.establishmentForm.value,
        createAt: new Date(), // On s'assure que la date de création est toujours la date actuelle
      };

      this.establishmentService.create(establishmentData).subscribe({
        next: (response) => {
          console.log('Établissement créé avec succès', response);
          this.loading = false;
          this.activeModal.close()
          this.router.navigateByUrl("/admin").then(
            ()=> {
              window.location.reload()
            }
          );

        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'établissement', error);
          this.loading = false;
        }
      });
    } else {
      console.error('Formulaire non valide');
      this.loading = false;
    }
  }
}
