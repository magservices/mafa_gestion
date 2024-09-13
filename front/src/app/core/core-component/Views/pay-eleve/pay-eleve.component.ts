import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Eleve} from "../../shared/model/Eleve";
import {DecimalPipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-pay-eleve',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DecimalPipe
  ],
  templateUrl: './pay-eleve.component.html',
  styleUrl: './pay-eleve.component.scss'
})
export class PayEleveComponent implements OnInit{
  activeModal = inject(NgbActiveModal);
  @Input() componentName!: string;
  @Input() student!: Eleve;

  ngOnInit() {
    console.log(this.student);
  }
}
