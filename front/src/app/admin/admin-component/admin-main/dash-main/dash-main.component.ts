import { Component } from '@angular/core';
import {SidebarComponent} from "../../layout/sidebar/sidebar.component";

@Component({
  selector: 'app-dash-main',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  templateUrl: './dash-main.component.html',
  styleUrl: './dash-main.component.scss'
})
export class DashMainComponent {

}
