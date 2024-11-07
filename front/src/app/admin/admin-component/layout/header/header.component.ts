import {Component, inject} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Eleve} from "../../../../core/core-component/shared/model/Eleve";
import {PayEleveComponent} from "../../../../core/core-component/Views/pay-eleve/pay-eleve.component";
import {SchoolNewComponent} from "../../views/school-new/school-new.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private modalService = inject(NgbModal);

  constructor() {
  }

  newEstablishment() {
    const modalRef = this.modalService.open(SchoolNewComponent,
      {size: "lg", animation: true, centered: true});
  }
}
