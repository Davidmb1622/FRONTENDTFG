import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-graciaspagina',
  templateUrl: './graciaspagina.component.html',
  styleUrls: ['./graciaspagina.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

@Injectable({
  providedIn: 'root'
})
export class GraciaspaginaComponent  implements OnInit {
  carrito: any = { items: [] };

  constructor(    private carritoService: CarritoService,
  ) { }



  fechaInicio!: string;
  fechaFin!: string;

  ngOnInit() {
    this.calcularEntrega();
    this.obtenerCarrito();
  }

  calcularEntrega() {
    const hoy = new Date();

    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() + 10);

    const fin = new Date(hoy);
    fin.setDate(hoy.getDate() + 12);

    this.fechaInicio = this.formatearFecha(inicio);
    this.fechaFin = this.formatearFecha(fin);
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  }

  obtenerCarrito() {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.obtenerCarrito(usuarioId).subscribe({
      next: (data) => {
        this.carrito = data;
      },
      error: () => {
        console.error('Error al cargar carrito');
      }
    });
  }

}
