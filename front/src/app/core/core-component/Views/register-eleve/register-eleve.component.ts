import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StudentService} from "../../shared/services/student.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-eleve',
  templateUrl: './register-eleve.component.html',
  styleUrl: './register-eleve.component.scss'
})
export class RegisterEleveComponent {
  studentForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: any = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,
              private studentService: StudentService, private router: Router) {
    this.studentForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      prenomPere: ['', Validators.required],
      nomPere: ['', Validators.required],
      tel1: ['', Validators.required],
      prenomMere: [''],
      nomMere: [''],
      tel2: [''],
      niveau: ['', Validators.required],
      classe: ['', Validators.required],
      prive: ['', Validators.required],
      transfere: ['', Validators.required],
      matricule: [''],

    });
  }

  ngOnInit(): void {
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
    if (this.studentForm.valid && this.selectedFile) {
      this.studentService.createStudent(this.studentForm.value, this.selectedFile).subscribe(
        (student) => {
          this.router.navigateByUrl("/dash/student");
        }
      )
    } else {
      console.log('Form invalid');
    }
  }
}
