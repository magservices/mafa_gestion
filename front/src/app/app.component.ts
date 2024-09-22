import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NotificationService} from "./core/core-component/shared/services/notification.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'mafa-gestion';


  constructor(private notificationService : NotificationService) {}

  ngOnInit() {
    this.notificationService.pollNotifications().subscribe(notification => {
      console.log('Notification received:', notification);
      // Traitez les notifications ici
    });
  }

}
