import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { Carrito } from '../app/Models/Carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/carritos';

  //guarda el total de productos en el carrito
  private cantidadCarritoSubject = new BehaviorSubject<number>(0);
  cantidadCarrito$ = this.cantidadCarritoSubject.asObservable();


  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  agregarProducto(usuarioId: number, productoId: number, cantidad: number, talla: string,color: string) {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/${usuarioId}/agregarproducto`, {
        productoId,
        cantidad,
        talla,
        color
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  obtenerCarrito(usuarioId: number): Observable<Carrito> {
    return this.http.get<Carrito>(
      `${this.apiUrl}/usuario/${usuarioId}`,
      this.getAuthHeaders()
    ).pipe(
      tap(carrito => this.actualizarCantidadTotal(carrito))
    );
  }

  eliminarProducto(usuarioId: number, productoId: number, talla: string): Observable<Carrito> {
    return this.http.delete<Carrito>(
      `${this.apiUrl}/${usuarioId}/eliminarproducto/${productoId}?talla=${talla}`,
      this.getAuthHeaders()
    );
  }

  vaciarCarrito(usuarioId: number) {
    return this.http.delete(
      `${this.apiUrl}/${usuarioId}/vaciar`,
      this.getAuthHeaders()
    );
  }

  actualizarCantidad(usuarioId: number, productoId: number, talla: string, cantidad: number) {
    return this.http.put(`http://localhost:8081/carritos/${usuarioId}/actualizar`, {
      productoId,
      talla,
      cantidad
    });
  }

  actualizarCantidadTotal(carrito: any) {
    const total = carrito.items.reduce((sum: number, item: any) => sum + item.cantidad, 0);
    this.cantidadCarritoSubject.next(total);
  }

  checkout(usuarioId: number, direccion: string, metodoPago: string) {
    return this.http.post(
      `${this.apiUrl}/${usuarioId}/checkout`,
      { direccion, metodoPago },
      this.getAuthHeaders()
    );
  }
}
