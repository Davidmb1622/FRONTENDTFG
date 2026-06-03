import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OllamaService {

  private http = inject(HttpClient);
  private url = "http://localhost:8081/ollama/ask";

  preguntar(prompt: string): Observable<string> {
    return this.http.post(this.url, { prompt }, { responseType: 'text' });
  }

}
