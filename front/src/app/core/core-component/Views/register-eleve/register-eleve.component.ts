import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";
import {Router} from "@angular/router";
import {generateStudentId} from "../../shared/utilis/studentID";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {establishment} from "../../../../../environments/environment";
import {User} from "../../shared/model/User";
import {UserService} from "../../shared/services/user.service";
import {PayEleveComponent} from "../pay-eleve/pay-eleve.component";

@Component({
  selector: 'app-register-eleve',
  templateUrl: './register-eleve.component.html',
  styleUrl: './register-eleve.component.scss'
})
export class RegisterEleveComponent implements OnInit {

  studentForm!: FormGroup;
  loading = false;  // Variable pour suivre l'état du chargement
  selectedFile: File = new File([''], '');
  previewUrl: any = null;
  user!: User;
  showMatricule: boolean = false;
  private modalService = inject(NgbModal);

  filteredClasses: string[] = [];
  cycle1Classes = ['1ère A','1ère B', '2ème A','2ème B', '3ème A','3ème B','4ème A','4ème B','5ème A', '5ème B', '6ème A', '6ème B'];
  cycle2Classes = ['7ème A','7ème B','8ème A', '8ème B', '9ème A','9ème B','9ème C'];
  santeClasses=[]

  lyceeClasses = ['10è CG', '11è L', '11è Sc', '11è SES','TSS', 'TSECO', 'TSEXP','TSE', 'TLL', 'TAL'];
  professionalClasses = ['1ère TC', '2è TC', '3è TCA', '4è TCA', '1ère SD', '2è SD', '3è SD', '4è SD', '1ère EM', '2è EM', '3è EM', '4è EM'];

  onLevelChange(): void {
    const selectedLevel = this.studentForm.get('niveau')?.value;
    if (selectedLevel === 'cycle1') {
      this.filteredClasses = this.cycle1Classes;
    } else if (selectedLevel === 'cycle2') {
      this.filteredClasses = this.cycle2Classes;
    } else if (selectedLevel === 'Lycee') {
      this.filteredClasses = this.lyceeClasses;
    } else if (selectedLevel === 'Professionnel') {
      this.filteredClasses = this.professionalClasses;
    } else if (selectedLevel === 'sante') {
      this.filteredClasses = this.santeClasses;
    } else {
      this.filteredClasses = [];
    }
  }
  





  constructor(private fb: FormBuilder,
              private studentService: StudentService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      dateNaissance: [''],
      prenomPere: [''],
      nomPere: [''],
      tel1: ['', Validators.required],
      prenomMere: [''],
      nomMere: [''],
      studentID: [''],
      tel2: [''],
      niveau: ['', Validators.required],
      classe: ['', Validators.required],
      prive: [''],
      transfere: [''], 
      matricule: [''],
      establishment: [establishment.key],
      userKey: ['']

    });

    this.randingStudentByLevel();
    this.onLevelChange();
  }

  // Une méthode pratique pour accéder facilement aux contrôles
  get f() {
    return this.studentForm.controls;
  }


  onStatutChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showMatricule = selectedValue === 'Étatique';
  }

  onPhoneNumberInput(event: any): void {
    event.target.value = this.formatPhoneNumber(event.target.value);
  }


  formatPhoneNumber(value: string): string {
    value = value.replace(/\D/g, '');
    return value.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Optionally set the file into the form control
      this.selectedFile = file;
    } else {
      this.selectedFile = new File([''], '');
    }
  }

  // Trigger file upload when "Mettre une photo" is clicked
  triggerFileUpload(): void {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput.click();
  }


  // Remove image preview and reset file input
  removeImage(): void {
    this.previewUrl = null;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput.value = '';  // Clear the file input
  }

  /*
   * Classement des élèves selon le niveau
   * Fondamentale ou lycee
   */
  randingStudentByLevel() {
    this.userService.getUsersByAccessKey().subscribe(
      (user: User) => {
        this.user = user;
      }
    )
  }

  

  onSubmit(): void {
    this.loading = false;  // Variable pour suivre l'état du chargement
    if (this.studentForm.valid && this.selectedFile) {
      this.studentForm.value.studentID = generateStudentId();

      this.studentForm.value.userKey = this.user && this.user.roles[0] === "ROLE_DIRECTOR"
        ? "primary school"
        : this.user.roles[0] === "ROLE_CENSOR"
          ? "high school"
          : console.log("add");

      console.log(this.studentForm.value);
      this.studentService.createStudent(this.studentForm.value, this.selectedFile).subscribe(
        (student) => {
          this.loading = true;  // Variable pour suivre l'état du chargement

          if (student.transfere !== "Étatique") {
            const modalRef = this.modalService.open(PayEleveComponent,
              {size: "lg", animation: true, centered: true, backdrop: 'static'});
            modalRef.componentInstance.componentName = 'first payment';
            modalRef.componentInstance.student = student;
          } else {
            this.router.navigateByUrl("dash/student").then(
              () => {
                window.location.reload()
              }
            )
          }
        }
      )
    } else {
      console.log('Form invalid');
    }
  }
}
