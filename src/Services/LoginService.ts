import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Login} from "../app/Models/Login";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);

  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();

  private baseUrl = 'http://localhost:8081/usuarios';

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }
  login(datos: Login): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, datos);
  }

  guardarSesion(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('usuarioId', res.usuarioId);
    localStorage.setItem('rol', res.rol);

    this.setAuthState(true);
  }

  logout() {
    localStorage.clear();
    this.setAuthState(false);
  }
}
