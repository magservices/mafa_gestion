import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Eleve} from "../../shared/model/Eleve";
import {StudentService} from "../../shared/services/student.service";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-eleve-page',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './eleve-page.component.html',
  styleUrl: './eleve-page.component.scss'
})
export class ElevePageComponent implements OnInit{
  students! : Eleve[];

  constructor(private studentService: StudentService) {
  }

  ngOnInit() {
    this.getStudents();
  }

  private getStudents() {
    this.studentService.getAllStudent().subscribe(
      (resStudent)=> {
        this.students = resStudent;
      }
    )
  }
}
