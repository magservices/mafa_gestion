import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterPageComponent } from './core/core-component/layout/footer-page/footer-page.component';
import { HeaderPageComponent } from './core/core-component/layout/header-page/header-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mafa-gestion';
}
