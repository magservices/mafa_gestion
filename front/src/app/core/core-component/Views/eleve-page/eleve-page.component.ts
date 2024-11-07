import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Eleve} from "../../shared/model/Eleve";
import {StudentService} from "../../shared/services/student.service";
import {NgOptimizedImage, SlicePipe} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/model/User";

@Component({
  selector: 'app-eleve-page',
  standalone: true,
  imports: [
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

  constructor(private studentService: StudentService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsersByAccessKey().subscribe(
      (user) => {
        if (user !== undefined) {
          this.user = user
          this.getStudents(user);
        }
      }
    )
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

        // Filtrer en fonction du rôle ou retourner tous les étudiants
        this.students = userKey ? resStudent.filter(student => student.userKey === userKey) : resStudent;

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
}
