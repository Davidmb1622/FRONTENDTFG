import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ProductoService } from "../../Services/ProductoService";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@Injectable({
  providedIn: 'root'
})

export class BuscadorComponent implements OnInit {


  searchText: string = '';
  cantidadCarrito: number = 0;

  constructor(private router: Router, private productoService: ProductoService,private carritoService:CarritoService) {}

  ngOnInit(): void {
    this.carritoService.cantidadCarrito$.subscribe(total => {
      this.cantidadCarrito = total;
    });

    // También puedes cargar la cantidad inicial
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    if (usuarioId) {
      this.carritoService.obtenerCarrito(usuarioId).subscribe();
    }

  }

  buscar() {

    const texto = this.searchText.trim();
    if (!texto) return;

    this.router.navigate(['/trajes'], {
      queryParams: { texto: texto }
    });

    this.searchText = '';

  }

  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'ADMIN';
  }

}
