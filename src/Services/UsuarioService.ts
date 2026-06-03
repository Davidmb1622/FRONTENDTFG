import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Verificacion } from "../app/Models/Verificacion";
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8081/usuarios';



  verificarCodigo(codigo: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/verificarcodigo`, { codigoVerificacion: codigo }, { responseType: 'text' });
  }

  obtenerUsuario(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  actualizarUsuario(id: number, usuario: any) {
    return this.http.put(`${this.baseUrl}/${id}`, usuario);
  }

}
