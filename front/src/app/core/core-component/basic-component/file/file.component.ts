import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../shared/services/student.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eleve } from '../../shared/model/Eleve';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [CommonModule,NgOptimizedImage,FormsModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {
  activeModal = inject(NgbActiveModal);

  @Input() id!: number;
  @Input() students!: Eleve[];
  studentsInSelectedClass!: Eleve[];

  // Options pour la liste déroulante
  schoolTypes: string[] = ['Étatique', 'Privé'];
  selectedSchoolType: string | undefined;


  
  schoolNiveaux:string[] = ['Lycee', 'Professionnel'];
  lyceeClasses = ['10èCG', '11èL', '11èSc', '11èSES','TSS', 'TSECO', 'TSEXP','TSE', 'TLL', 'TAL'];
  professionalClasses = ['1ère TC', '2è TC', '3è TCA', '4è TCA', '1ère SD', '2è SD', '3è SD', '4è SD', '1ère EM', '2è EM', '3è EM', '4è EM'];
  selectedSchoolNiveau: string ='Lycee';
  schoolTypesClass: string[] =this.lyceeClasses;
  selectedSchoolClass : string | undefined;


  @Input() establishment!: string;
  
  selectedFileExcle: File | null = null;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFileExcle = input.files[0];
    }
  }

  constructor(private studentService: StudentService) {
  }
  ngOnInit(): void {
    
  }
  onChangeOption(): void {
    if(this.selectedSchoolNiveau==='Lycee'){
      this.schoolTypesClass=this.lyceeClasses;
    }else{
      this.schoolTypesClass=this.professionalClasses;
    }
  }
  onSubmit(): void {
      if(this.selectedSchoolType && this.selectedFileExcle!=null){
        this.studentService.uploadFile(this.selectedFileExcle,this.establishment,this.selectedSchoolType);
        this.activeModal.close();
      }
    } 
    onSubmitPdf(): void {
      if(this.selectedSchoolClass){
        this.studentsInSelectedClass = this.students.filter(student => student.classe === this.selectedSchoolClass);
        this.studentService.generatePdf(this.studentsInSelectedClass, this.selectedSchoolClass);
        this.activeModal.close();
      }
    }
    
}
