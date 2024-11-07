import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {environment, establishment} from "../../../../../environments/environment";
import { User } from "../model/User";

@Injectable({
    providedIn: 'root'
  })
export class UserService{
    constructor(private http: HttpClient) {}

    login(data: { username: string; password: string }):Observable<string>{
        return this.http.post<string>(`${environment.apiUrl}/login`,data,{responseType: 'text' as 'json'});
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/user-register/create`, user);
      }

    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${environment.apiUrl}/user-register/all/`);
    }

    getUsersByAccessKey() {
      return this.http.get<User>(`${environment.apiUrl}/user-register/key/${establishment.userKey}`);
    }
}
