import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";
import {ActivatedRoute, Router} from "@angular/router";
import {generateStudentId} from "../../shared/utilis/studentID";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {establishment} from "../../../../../environments/environment";
import {User} from "../../shared/model/User";
import {UserService} from "../../shared/services/user.service";
import {PayEleveComponent} from "../pay-eleve/pay-eleve.component";
import { Eleve } from '../../shared/model/Eleve';
import { FileComponent } from '../../basic-component/file/file.component';

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
  studentA!:Eleve;
  
  showMatricule: boolean = false;
  private modalService = inject(NgbModal);

  filteredClasses: string[] = [];
  cycle1Classes = ['1ère A','1ère B', '2ème A','2ème B', '3ème A','3ème B','4ème A','4ème B','5ème A', '5ème B', '6ème A', '6ème B'];
  cycle2Classes = ['7ème A','7ème B','8ème A', '8ème B', '9ème A','9ème B','9ème C','9ème D','9ème E'];
  santeClasses=[]

  lyceeClasses = ['10èCG', '11èL', '11èS', '11èSES','TSS', 'TSECO', 'TSEXP','TSE', 'TLL', 'TAL'];
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
              private router: Router, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID à partir de l'URL
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
    //  prive: [''],
      transfere: [''], 
      matricule: [''],
      establishment: [establishment.key],
      userKey: ['']

    });

    if (id) {
      this.studentService.getStudentByID(+id).subscribe((data) => {
        this.studentA = data; // Stocker les données de l'élève
        if(this.studentA.transfere==='Étatique'){this.showMatricule=true}
        this.studentForm = this.fb.group({
          prenom: this.studentA.prenom,
          nom: this.studentA.nom,
          dateNaissance: this.studentA.dateNaissance,
          prenomPere: this.studentA.prenomMere,
          nomPere: this.studentA.nomPere,
          tel1: this.studentA.tel1,
          prenomMere: this.studentA.prenomMere,
          nomMere: this.studentA.nomMere,
          studentID: this.studentA.studentID,
          tel2: this.studentA.tel2,
          niveau: this.studentA.niveau,
          classe: this.studentA.classe,
         // prive: this.studentA.prive,
          transfere: this.studentA.transfere, 
          matricule:this.studentA.matricule,
          establishment: [establishment.key], 
          userKey: this.studentA.userKey
    
        });
    
      });

    }

    
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

  
  Import(){
    const id=1;
    const modalRef = this.modalService.open(FileComponent,
      {animation: true, centered: true, backdrop: 'static'});
       modalRef.componentInstance.id = id; 
       modalRef.componentInstance.establishment=establishment.key
  }

  onSubmit(): void {
    this.loading = false;  // Variable pour suivre l'état du chargement
    if (this.studentForm.valid && this.selectedFile) {
      this.studentForm.value.studentID = generateStudentId();
      if(this.studentForm.value.dateNaissance==""){
        this.studentForm.value.dateNaissance="1900-01-01";
      }
      this.studentForm.value.userKey = this.user && this.user.roles[0] === "ROLE_DIRECTOR"
        ? "primary school"
        : this.user.roles[0] === "ROLE_CENSOR"
          ? "high school"
          : console.log("add");

          const id = this.route.snapshot.paramMap.get('id');
      if(id){
        this.loading = true;
        this.studentService.updateStudent(this.studentForm.value,this.studentA.id, this.selectedFile).subscribe(
          () => this.router.navigateByUrl(`dash/detail-student/${this.studentA.id}`).then( 
            () => {
              window.location.reload()
            }
          )
        );
      }else{
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
      }

    } else {
     // console.log('Form invalid');
    }
  }
}
