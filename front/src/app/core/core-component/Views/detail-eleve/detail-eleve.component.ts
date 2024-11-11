import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {StudentService} from "../../shared/services/student.service";
import {Eleve} from "../../shared/model/Eleve";
import {DatePipe, DecimalPipe, NgOptimizedImage} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PayEleveComponent} from "../pay-eleve/pay-eleve.component";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/model/User";
import { DeleteComponent } from '../../basic-component/delete/delete.component';
import { EditPayComponent } from '../../basic-component/edit-pay/edit-pay.component';

@Component({
  selector: 'app-detail-eleve',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DatePipe,
    RouterLink,
    DecimalPipe
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
  user! : User;

  private modalService = inject(NgbModal);

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID à partir de l'URL
    if (id) {
      //console.log(id);
      this.studentService.getStudentByID(+id).subscribe((data) => {
        this.student = data; // Stocker les données de l'élève
        console.log(this.student)
      });
    }

    this.userService.getUsersByAccessKey().subscribe(
      (user)=> {
        if (user != undefined) {
          this.user = user;
        }
      }
    )
  }

  newPay(component: string, student: Eleve) {
    const modalRef = this.modalService.open(PayEleveComponent,
      {size:"lg" , animation: true, centered: true });
    modalRef.componentInstance.componentName = component;
    modalRef.componentInstance.student = student;
  }

  supprimer(id:number){
    const modalRef = this.modalService.open(DeleteComponent,
      {centered: true, animation: true});
       modalRef.componentInstance.id = id;
  }

  editerPay(id:number){
    const modalRef = this.modalService.open(EditPayComponent,
      {centered: true, animation: true});
       modalRef.componentInstance.id = id;
  }

}
