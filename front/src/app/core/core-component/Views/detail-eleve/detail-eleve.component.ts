import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {StudentService} from "../../shared/services/student.service";
import {Eleve} from "../../shared/model/Eleve";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-detail-eleve',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DatePipe,
    RouterLink
  ],
  templateUrl: './detail-eleve.component.html',
  styleUrl: './detail-eleve.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('0.5s ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({opacity: 0}))
      ])
    ]),
    trigger('slideInLeft', [
      state('void', style({transform: 'translateX(-100%)', opacity: 0})),
      transition(':enter', [
        animate('0.5s ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ])
    ])
  ]
})
export class DetailEleveComponent implements OnInit {

  student!: Eleve;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID à partir de l'URL
    if (id) {
      console.log(id)
      this.studentService.getStudentByID(+id).subscribe((data) => {
        this.student = data; // Stocker les données de l'élève
        console.log(this.student)
      });
    }
  }
}
