import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from "../app/Models/Reserva";
import { EstadoReserva } from "../app/Models/EstadoReserva"
import {CrearReserva} from "../app/Models/CrearReserva";

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8081/reservas';
  private auth() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  }

  crearReserva(reserva: CrearReserva): Observable<Reserva> {
    const token = localStorage.getItem('token');
    return this.http.post<Reserva>(this.baseUrl, reserva, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  obtenerReservasUsuario(usuarioId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  cancelarReservaUsuario(reservaId: number, usuarioId: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${reservaId}/usuario/${usuarioId}/cancelar`, {});
  }

  cambiarEstadoUsuario(reservaId: number, usuarioId: number, estado: EstadoReserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${reservaId}/usuario/${usuarioId}/estado?estado=${estado}`, {});
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.put(
      `${this.baseUrl}/${id}/estado?estado=${estado}`,
      {},
      this.auth()
    );
  }

  obtenerTodasReservas() {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/todos`,
      this.auth()
    );
  }
}
