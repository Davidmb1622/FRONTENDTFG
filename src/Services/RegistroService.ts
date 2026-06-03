import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Registro} from "../app/Models/Registro";

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private http = inject(HttpClient);

  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();


  private baseUrl = 'http://localhost:8081/usuarios';

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  registrar(registro: Registro): Observable<any>{
    return this.http.post(`${this.baseUrl}/registro`, registro);
  }
}
