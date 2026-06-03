import { inject, Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../app/Models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8081/productos';
  private auth() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  }

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }


  obtenerNovedades() {
    return this.http.get<Producto[]>(`${this.apiUrl}/novedades`);
  }


  obtenerPorTipo(tipo: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/tipo/${tipo}`);
  }



  buscar(params: any): Observable<Producto[]> {
    return this.http.get<Producto[]>('http://localhost:8081/productos/buscar', { params });
  }


  crear(dto: any) {
    return this.http.post(`${this.apiUrl}/crear`, dto, this.auth());
  }

  actualizarProducto(id: number, dto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, dto, this.auth());
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}/eliminar`, this.auth());
  }

  reindexar() {
    return this.http.post(`${this.apiUrl}/reindexar`, {}, this.auth());
  }


}

