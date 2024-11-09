import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Eleve} from "../model/Eleve";
import {environment, establishment} from "../../../../../environments/environment";
import {StudentPayment} from "../model/StudentPayment";
import {Establishment} from "../../../../admin/admin-component/shared/models/establishment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {
  }

  createStudent(eleveData: Eleve, photo: File): Observable<Eleve> {
    const formData: FormData = new FormData();
    formData.append('eleveData', JSON.stringify(eleveData));
    formData.append('photo', photo);

    const headers = new HttpHeaders({
      // Add any custom headers here if needed
    });

    return this.http.post<Eleve>(`${environment.apiUrl}/eleve/create`, formData, {headers});
  }


  updateStudent(eleveData: Eleve,id:number, photo: File): Observable<Eleve> {
    const formData: FormData = new FormData();
    formData.append('eleveData', JSON.stringify(eleveData));
    formData.append('photo', photo);

    const headers = new HttpHeaders({
      // Add any custom headers here if needed
    });

    return this.http.post<Eleve>(`${environment.apiUrl}/eleve/${id}`, formData, {headers});
  }
// Ajouter un paiement


  getAllStudent(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${environment.apiUrl}/eleve/establishment/${establishment.key}`);
  }


  getStudentByID(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${environment.apiUrl}/eleve/${id}`);
  }
  getPayByID(id: number): Observable<StudentPayment> {
    return this.http.get<StudentPayment>(`${environment.apiUrl}/student_payment/${id}`);
  }

  updatePayment(payment: StudentPayment, id: number): Observable<StudentPayment> {
    return this.http.post<StudentPayment>(`${environment.apiUrl}/student_payment/${id}`,payment);
  }
  // Ajouter un paiement
  createPayment(payment: StudentPayment, registerStudentId: number): Observable<StudentPayment> {
    return this.http.post<StudentPayment>(`${environment.apiUrl}/student_payment/create`, {
      ...payment,
      register_student_id: registerStudentId
    });
  }

  

  // Récupérer tous les paiements
  getAllPayments(): Observable<StudentPayment[]> {
    return this.http.get<StudentPayment[]>(`${environment.apiUrl}/student_payment/establishment/${establishment.key}`);
  }

  // Méthode pour récupérer un établissement par ID
  getByName(name: string): Observable<Establishment> {
    return this.http.get<Establishment>(`${environment.apiUrl}/establishment/name/${name}`);
  }
  // Delete Eleve
  deleteEleve(id:number): Observable<any>{
    return this.http.delete<void>(`${environment.apiUrl}/eleve/${id}`);
  }
  // Delete Eleve Payement
  deletePay(id:number): Observable<any>{
    return this.http.delete<void>(`${environment.apiUrl}/student_payment/${id}`);
  }
}
