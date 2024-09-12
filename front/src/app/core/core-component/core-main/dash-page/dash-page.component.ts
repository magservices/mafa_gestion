import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterPageComponent } from '../../layout/footer-page/footer-page.component';
import { HeaderPageComponent } from '../../layout/header-page/header-page.component';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-dash-page',
  standalone: true,
  imports: [RouterOutlet,FooterPageComponent, HeaderPageComponent],
  templateUrl: './dash-page.component.html',
  styleUrl: './dash-page.component.scss'
})
export class DashPageComponent {
  ngOnInit(): void {
    const token = localStorage.getItem('USER-TOKEN-MAFA');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        
        // Vérifiez si le token est expiré
        const now = new Date().getTime() / 1000;  // Convertir en secondes
        if (decodedToken.exp < now) {
          localStorage.removeItem('USER-TOKEN-MAFA');
        }
      } catch (error) {
        localStorage.removeItem('USER-TOKEN-MAFA');
      }
    }
  }
}
