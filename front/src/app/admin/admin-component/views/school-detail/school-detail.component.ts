import {Component, inject, OnInit} from '@angular/core';
import {Establishment} from "../../shared/models/establishment";
import {EstablishmentService} from "../../shared/services/establishment.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe, DecimalPipe, NgClass} from "@angular/common";
import {log} from "electron-builder";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SchoolNewComponent} from "../school-new/school-new.component";
import {SchoolEditComponent} from "../school-edit/school-edit.component";
import {UserFormComponent} from "../../../../core/core-component/Views/user-form/user-form.component";
import {UserService} from "../../../../core/core-component/shared/services/user.service";
import {User} from "../../../../core/core-component/shared/model/User";
import {UserInfoComponent} from "../user-info/user-info.component";


@Component({
  selector: 'app-school-detail',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './school-detail.component.html',
  styleUrl: './school-detail.component.scss'
})
export class SchoolDetailComponent implements OnInit {
  establishment!: Establishment; // Use the model you defined
  isLoading = true;
  errorMessage: string | null = null;
  studentTotal: number = 0;
  paymentTotal: number = 0;
  private modalService = inject(NgbModal);
  access!: boolean;
  users: User[] = [];


  constructor(
    private establishmentService: EstablishmentService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id')); // Retrieve the ID from the route
    this.fetchEstablishment(id);
    this.loadUsers();
  }

  fetchEstablishment(id: number): void {
    this.establishmentService.getById(id).subscribe(
      (data) => {
        this.establishment = data;
        this.fetchStudentByEstablishment(data.accessKey);
        this.fetchStudentPaymentByEstablishment(data.accessKey);
        this.verifySoftwareAccess(data.expiryDate);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    );
  }

  verifySoftwareAccess(expiryDate: Date) {
    const currentDate = new Date(); // Date actuelle
    const expiry = new Date(expiryDate); // Date d'expiration

    // Comparaison explicite année, mois, jour
    if (currentDate.getFullYear() < expiry.getFullYear()) {
      // Si l'année actuelle est avant l'année d'expiration
      this.access = true;
    } else if (currentDate.getFullYear() === expiry.getFullYear()) {
      // Si on est dans la même année, vérifier le mois
      if (currentDate.getMonth() < expiry.getMonth()) {
        this.access = true;
      } else if (currentDate.getMonth() === expiry.getMonth()) {
        // Si on est dans le même mois, vérifier le jour
        this.access = currentDate.getDate() <= expiry.getDate();
      } else {
        this.access = false; // Mois actuel supérieur au mois d'expiration
      }
    } else {
      // Si l'année actuelle est après l'année d'expiration
      this.access = false;
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;

        console.log(this.users)
      },
      (error) => {
        this.errorMessage = 'Error fetching users: ' + error.message;
      }
    );
  }


  fetchStudentByEstablishment(establishmentName: string) {
    this.establishmentService.getAllStudent(establishmentName).subscribe(
      (student) => {
        this.studentTotal = student.length;
      }
    )
  }

  fetchStudentPaymentByEstablishment(establishmentName: string) {
    this.establishmentService.getAllPayments(establishmentName).subscribe(
      (payments) => {
        payments.forEach(
          (payment) => {
            this.paymentTotal += payment.amount;
          }
        )
      }
    )
  }

  editEstablishment(id: number | undefined): void {
    const modalRef = this.modalService.open(SchoolEditComponent,
      {size: "lg", animation: true, centered: true});
    modalRef.componentInstance.establishmentId = id;
  }

  showInfoUser(user: User): void {
    const modalRef = this.modalService.open(UserInfoComponent,
      {size: "lg", animation: true, centered: true});
    modalRef.componentInstance.user = user;
  }

  userEstablishment(): void {
    const modalRef = this.modalService.open(UserFormComponent,
      {size: "lg", animation: true, centered: true});
  }

  deleteEstablishment(id: number | undefined): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
      if (id !== undefined) {
        this.establishmentService.delete(id).subscribe({
          next: () => {
            console.log('Établissement supprimé avec succès');
            this.router.navigateByUrl("/admin").then(
              () => {
                window.location.reload();
              }
            )
          },
          error: (err) => {
            console.error('Erreur lors de la suppression', err);
          }
        });
      } else {
        console.log("Erreur au moment de la recuperation de l'information necessaire");
      }
    }
  }

}
