import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Eleve} from "../../shared/model/Eleve";
import {StudentService} from "../../shared/services/student.service";
import {CommonModule, NgOptimizedImage, SlicePipe} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {NgbModal, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/model/User";
import { FileComponent } from '../../basic-component/file/file.component';
import { DeleteComponent } from '../../basic-component/delete/delete.component';

@Component({
  selector: 'app-eleve-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    FormsModule,
    NgbPaginationModule,
    SlicePipe
  ],
  templateUrl: './eleve-page.component.html',
  styleUrl: './eleve-page.component.scss'
})
export class ElevePageComponent implements OnInit {
  students!: Eleve[];
  filteredStudents!: Eleve[];
  taile!: number;
  studentPage: number = 5;
  pageSize = 5;
  searchName: string = '';
  searchNiveau: string = '';
  searchClass: string = '';
  user! : User;

  private modalService = inject(NgbModal);

filteredClasses: string[] = [];
cycle1Classes = ['1ère A','1ère B', '2ème A','2ème B', '3ème A','3ème B','4ème A','4ème B','5ème A', '5ème B', '6ème A', '6ème B'];
cycle2Classes = ['7ème A','7ème B','8ème A', '8ème B', '9ème A','9ème B','9ème C'];
santeClasses=[]

lyceeClasses = ['10èCG', '11èL', '11èSc', '11èSES','TSS', 'TSECO', 'TSEXP','TSE', 'TLL', 'TAL'];
professionalClasses = ['1ère TC', '2è TC', '3è TCA', '4è TCA', '1ère SD', '2è SD', '3è SD', '4è SD', '1ère EM', '2è EM', '3è EM', '4è EM'];


onLevelChange(): void {
  const selectedLevel = this.searchNiveau;
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


  constructor(private studentService: StudentService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsersByAccessKey().subscribe(
      (user) => {
        this.user = user
        if (user !== undefined) {
          this.getStudents(user);
        }
      }
    );
    
    this.onLevelChange();
  }
  

  private getStudents(user: User) {
    this.studentService.getAllStudent().subscribe(
      (resStudent: Eleve[]) => {
        // Mapping des rôles aux valeurs userKey correspondantes
        const roleUserKeyMap: { [role: string]: string | null } = {
          "ROLE_DIRECTOR": "primary school",
          "ROLE_CENSOR": "high school",
        };

        const userRole = user.roles[0];
        const userKey = roleUserKeyMap[userRole];

       if (userRole === "ROLE_DIRECTOR") {
        // Cas spécifique pour le directeur : inclure 'high school' + 'transfere == prive'
        const students1 = resStudent.filter(student => 
          (student.userKey === 'high school' && student.transfere === 'Privé')
        );
        this.students = resStudent.filter(student => 
          (student.userKey === 'primary school')
        );
        this.students.push(...students1);

      } else {
        this.students = userKey ? resStudent.filter(student => student.userKey === userKey) : resStudent;
      } 


        this.filteredStudents = this.students;
        this.taile = this.filteredStudents.length;
      }
    )
  }

  onSearch() {
    this.filteredStudents = this.students.filter(student => {
      return (
        (!this.searchName || (student.prenom + ' ' + student.nom).toLowerCase().includes(this.searchName.toLowerCase())) &&
        (!this.searchNiveau || student.niveau.toLowerCase().includes(this.searchNiveau.toLowerCase())) &&
        (!this.searchClass || student.classe.toLowerCase().includes(this.searchClass.toLowerCase()))
      );
    });
  }


  initEleve() {
    this.filteredStudents = this.students;
  }

  export(){
  //  if(this.filteredStudents!=null && this.filteredStudents.length>0){
      const id=0;
    const modalRef = this.modalService.open(FileComponent,
      {centered: true, animation: true});
       modalRef.componentInstance.id = id; 
       modalRef.componentInstance.students = this.filteredStudents; 
  //  }
    
  }
  supprimer(id:number){
    const modalRef = this.modalService.open(DeleteComponent,
      {centered: true, animation: true});
       modalRef.componentInstance.id = id;
  }
}
