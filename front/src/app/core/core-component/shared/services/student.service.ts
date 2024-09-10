import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Eleve} from "../model/Eleve";
import {environment} from "../../../../../environments/environment";

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

  getAllStudent(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${environment.apiUrl}/eleve`);
  }

  getStudentByID(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${environment.apiUrl}/eleve/${id}`);
  }
}
