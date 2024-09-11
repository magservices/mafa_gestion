import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Eleve} from "../../shared/model/Eleve";
import {StudentService} from "../../shared/services/student.service";
import {NgOptimizedImage} from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eleve-page',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './eleve-page.component.html',
  styleUrl: './eleve-page.component.scss'
})
export class ElevePageComponent implements OnInit{
  students! : Eleve[];
  filteredStudents!: Eleve[]; 
  taile!:number;

  searchName: string = '';
  searchNiveau: string = '';
  searchClass: string = '';
  constructor(private studentService: StudentService) {
  }

  ngOnInit() {
    this.getStudents();
  }

  private getStudents() {
    this.studentService.getAllStudent().subscribe(
      (resStudent)=> {
        this.students = resStudent;
        this.filteredStudents=this.students;
        this.taile=this.filteredStudents.length;
      }
    )
  }

  onSearch() {
    this.filteredStudents = this.filteredStudents.filter(student => {
      return (
        (!this.searchName || (student.prenom + ' ' + student.nom).toLowerCase().includes(this.searchName.toLowerCase())) &&
        (!this.searchNiveau || student.niveau.toLowerCase().includes(this.searchNiveau.toLowerCase())) &&
        (!this.searchClass || student.classe.toLowerCase().includes(this.searchClass.toLowerCase()))
      );
    });
  }
  initEleve(){
    this.filteredStudents=this.students;
  }
}
