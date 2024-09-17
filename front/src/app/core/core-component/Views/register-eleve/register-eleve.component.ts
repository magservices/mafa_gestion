import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";
import {Router} from "@angular/router";
import {generateStudentId} from "../../shared/utilis/studentID";
import {PayEleveComponent} from "../pay-eleve/pay-eleve.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-register-eleve',
  templateUrl: './register-eleve.component.html',
  styleUrl: './register-eleve.component.scss'
})
export class RegisterEleveComponent implements OnInit{

  studentForm!: FormGroup;
  loading = false;  // Variable pour suivre l'état du chargement
  selectedFile: File | null = null;
  previewUrl: any = null;
  private modalService = inject(NgbModal);

  constructor(private fb: FormBuilder,
              private studentService: StudentService, private router: Router) {
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      prenomPere: ['', Validators.required],
      nomPere: ['', Validators.required],
      tel1: ['', Validators.required],
      prenomMere: [''],
      nomMere: [''],
      studentID: [''],
      tel2: [''],
      niveau: ['', Validators.required],
      classe: ['', Validators.required],
      prive: ['', Validators.required],
      transfere: ['', Validators.required],
      matricule: [''],

    });
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

  onSubmit(): void {
    this.loading = false;  // Variable pour suivre l'état du chargement
    if (this.studentForm.valid && this.selectedFile) {
      this.studentForm.value.studentID = generateStudentId();
      this.studentService.createStudent(this.studentForm.value, this.selectedFile).subscribe(
        (student) => {
          this.loading = true;  // Variable pour suivre l'état du chargement
          const modalRef = this.modalService.open(PayEleveComponent,
            {size: "lg", animation: true, centered: true, backdrop: 'static'});
          modalRef.componentInstance.componentName = 'first payment';
          modalRef.componentInstance.student = student;

        }
      )
    } else {
      console.log('Form invalid');
    }
  }
}
