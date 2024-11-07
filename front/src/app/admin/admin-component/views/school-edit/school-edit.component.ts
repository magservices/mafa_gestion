import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EstablishmentService} from "../../shared/services/establishment.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Establishment} from "../../shared/models/establishment";
import {Observable} from "rxjs";
import {NgIf} from "@angular/common";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-school-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './school-edit.component.html',
  styleUrls: ['./school-edit.component.scss']  // Correction de `styleUrl` en `styleUrls`
})
export class SchoolEditComponent implements OnInit {
  establishmentForm!: FormGroup;
  loading: boolean = false;
  @Input() establishmentId!: number;  // Pour stocker l'ID de l'établissement
  activeModal = inject(NgbActiveModal);

  constructor(
    private formBuilder: FormBuilder,
    private establishmentService: EstablishmentService,
    private router: Router,
    private route: ActivatedRoute  // Pour récupérer les paramètres de l'URL
  ) {
  }

  ngOnInit(): void {
    // Initialisation du formulaire
    this.establishmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],  // Numéro de téléphone à 8 chiffres
      subscriptionType: ['', Validators.required],
      modalType: ['', Validators.required],  // Le type de modèle
      price: [0, [Validators.required, Validators.min(0)]],
      month: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required],
    });

    console.log(this.establishmentId)
    if (this.establishmentId !== undefined) {
      this.loadEstablishmentData(this.establishmentId);
    }
  }

  // Charger les données de l'établissement existant pour la mise à jour
  loadEstablishmentData(id: number): void {
    this.establishmentService.getById(id).subscribe({
      next: (establishment: Establishment) => {
        this.establishmentForm.patchValue({
          name: establishment.name,
          address: establishment.address,
          phone: establishment.phone,
          subscriptionType: establishment.subscriptionType,
          modalType: establishment.modalType,
          price: establishment.price,
          month: establishment.month,
          expiryDate: establishment.expiryDate ? new Date(establishment.expiryDate).toISOString().split('T')[0] : ''
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'établissement', error);
      }
    });
  }

  onSubmit(): void {
    if (this.establishmentForm.valid) {
      this.loading = true;

      const establishmentData = {
        ...this.establishmentForm.value,
        createAt: this.establishmentId ? undefined : new Date(),  // Ajouter la date de création seulement si c'est un nouvel établissement
      };

      let request$: Observable<Establishment>;

      if (this.establishmentId) {
        // Si un ID est présent, on met à jour
        request$ = this.establishmentService.update(this.establishmentId, establishmentData);
      } else {
        // Sinon, on crée un nouvel établissement
        request$ = this.establishmentService.create(establishmentData);
      }

      request$.subscribe({
        next: (response) => {
          console.log(this.establishmentId ? 'Établissement mis à jour avec succès' : 'Établissement créé avec succès', response);
          this.activeModal.close();
          window.location.reload(); // Rediriger après la création/mise à jour
        },
        error: (error) => {
          console.error(this.establishmentId ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création', error);
          this.loading = false;
        }
      });
    } else {
      console.error('Formulaire non valide');
    }
  }
}
