import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterPageComponent } from '../../layout/footer-page/footer-page.component';
import { HeaderPageComponent } from '../../layout/header-page/header-page.component';
@Component({
  selector: 'app-dash-page',
  standalone: true,
  imports: [RouterOutlet,FooterPageComponent, HeaderPageComponent],
  templateUrl: './dash-page.component.html',
  styleUrl: './dash-page.component.scss'
})
export class DashPageComponent {

}
