import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterPageComponent} from '../../layout/footer-page/footer-page.component';
import {HeaderPageComponent} from '../../layout/header-page/header-page.component';
import {jwtDecode} from 'jwt-decode';
import {StudentService} from "../../shared/services/student.service";
import {establishment} from "../../../../../environments/environment";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-dash-page',
  standalone: true,
  imports: [RouterOutlet, FooterPageComponent, HeaderPageComponent, DatePipe],
  templateUrl: './dash-page.component.html',
  styleUrl: './dash-page.component.scss'
})
export class DashPageComponent implements OnInit{
  access: boolean = true;
  isConnected: boolean = true;
  expiryDate!: Date;

  constructor(private establishmentService: StudentService) {
  }


  ngOnInit() {
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
    // Souscrire au statut de connexion
    this.fetchEstablishment();
  }

  fetchEstablishment(): void {
    this.establishmentService.getByName(establishment.key).subscribe(
      (data) => {
        this.verifySoftwareAccess(data.expiryDate);
        this.expiryDate = data.expiryDate
      }
    );
  }

  verifySoftwareAccess(expiryDate: Date) {
    const currentDate = new Date(); // Date actuelle
    const expiry = new Date(expiryDate); // Date d'expiration

    // Comparaison explicite année, mois, jour
    if (currentDate.getFullYear() < expiry.getFullYear()) {
      // Si l'année actuelle est avant l'année d'expiration
      this.access = true;
    } else if (currentDate.getFullYear() === expiry.getFullYear()) {
      // Si on est dans la même année, vérifier le mois
      if (currentDate.getMonth() < expiry.getMonth()) {
        this.access = true;
      } else if (currentDate.getMonth() === expiry.getMonth()) {
        // Si on est dans le même mois, vérifier le jour
        this.access = currentDate.getDate() <= expiry.getDate();
      } else {
        this.access = false; // Mois actuel supérieur au mois d'expiration
      }
    } else {
      // Si l'année actuelle est après l'année d'expiration
      this.access = false;
    }
  }
}
