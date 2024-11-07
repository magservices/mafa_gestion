import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  activeModal = inject(NgbActiveModal);
  @Input() componentName!: string;

  closeModal() {
    this.activeModal.close();
  }

  logout() {
    if (localStorage.getItem('USER-TOKEN-MAFA')) {
      localStorage.removeItem('USER-TOKEN-MAFA');
      window.location.reload();
    }
  }
}
