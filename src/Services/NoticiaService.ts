import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NoticiaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/noticias';
  private auth() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  }
  obtenerNoticias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/listar`);
  }

  crearNoticia(noticia: any) {
    return this.http.post(`${this.apiUrl}/crear`, noticia, this.auth());
  }

  eliminarNoticia(id: number) {
    return this.http.delete(`${this.apiUrl}/eliminar?id=${id}`, this.auth());
  }

}
