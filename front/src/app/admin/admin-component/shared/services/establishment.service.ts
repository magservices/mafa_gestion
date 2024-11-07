import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Establishment} from '../models/establishment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {environment, establishment} from "../../../../../environments/environment";
import {Eleve} from "../../../../core/core-component/shared/model/Eleve";
import {StudentPayment} from "../../../../core/core-component/shared/model/StudentPayment";

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  constructor(private http: HttpClient) {
  }

  // Méthode pour récupérer tous les établissements
  getAll(): Observable<Establishment[]> {
    return this.http.get<Establishment[]>(`${environment.apiUrl}/establishment`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Méthode pour récupérer un établissement par ID
  getById(id: number): Observable<Establishment> {
    return this.http.get<Establishment>(`${environment.apiUrl}/establishment/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllStudent(establishmentName: string): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${environment.apiUrl}/eleve/establishment/${establishmentName}`);
  }

  // Récupérer tous les paiements
  getAllPayments(establishmentName: string): Observable<StudentPayment[]> {
    return this.http.get<StudentPayment[]>(`${environment.apiUrl}/student_payment/establishment/${establishmentName}`);
  }

  // Méthode pour créer un nouvel établissement
  create(establishment: Establishment): Observable<Establishment> {
    return this.http.post<Establishment>(`${environment.apiUrl}/establishment/new`, establishment, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Méthode pour mettre à jour un établissement existant
  update(id: number, establishment: Establishment): Observable<Establishment> {
    return this.http.put<Establishment>(`${environment.apiUrl}/establishment/${id}/edit`, establishment, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Méthode pour supprimer un établissement
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/establishment/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Options HTTP pour les requêtes (headers)
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Gestion des erreurs
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
