import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ProductoService} from "../../Services/ProductoService";
import {Producto} from "../Models/Producto";
import {CarritoService} from "../../Services/CarritoService";


@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.scss'],
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

export class PresentacionComponent  implements OnInit {


  novedades: Producto[] = [];
  carrito: any = { items: [] };

  cargando = false;
  error = '';

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    this.cargarNovedades();
    this.obtenerCarrito();

  }


  cargarNovedades(): void {
    this.cargando = true;
    this.error = '';

    this.productoService.obtenerNovedades().subscribe({
      next: (data) => {
        this.novedades = data.slice(0, 4);
        this.cargando = false;
      },
      error: async () => {
        this.error = 'No se pudieron cargar las novedades';
        this.cargando = false;
      }
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
