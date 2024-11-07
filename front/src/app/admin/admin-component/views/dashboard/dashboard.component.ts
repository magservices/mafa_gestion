import {Component, OnInit} from '@angular/core';
import {EstablishmentService} from "../../shared/services/establishment.service";
import {Establishment} from "../../shared/models/establishment";
import {DatePipe, DecimalPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  establishments: Establishment[] = [];

  constructor(private establishmentService: EstablishmentService) {
  }

  ngOnInit(): void {
    this.getEstablishments();
  }

  // Récupère la liste des établissements
  getEstablishments(): void {
    this.establishmentService.getAll().subscribe(
      (data) => {
        this.establishments = data
        console.log(this.establishments)
      },
      (error) => console.error(error)
    );

  }

}
