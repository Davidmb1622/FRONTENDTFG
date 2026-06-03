// src/app/Services/PedidoService.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/pedidos';

  private auth() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  }
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  obtenerPedidos(usuarioId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/usuario/${usuarioId}`,
      this.getAuthHeaders()
    );
  }

  obtenerTodosPedidos() {
    return this.http.get<any[]>(
      `${this.apiUrl}/admin/todos`,
      this.auth()
    );
  }

  cancelarPedido(pedidoId: number) {
    return this.http.put(
      `${this.apiUrl}/${pedidoId}/cancelar`,
      {},
      this.getAuthHeaders()
    );
  }

  cambiarDireccion(pedidoId: number, direccion: string) {
    return this.http.put(
      `${this.apiUrl}/${pedidoId}/direccion`,
      { direccion },
      this.getAuthHeaders()
    );
  }

  cambiarEstado(pedidoId: number, estado: string) {
    return this.http.put(
      `${this.apiUrl}/${pedidoId}/estado`,
      { estado },
      this.getAuthHeaders()
    );
  }
}
