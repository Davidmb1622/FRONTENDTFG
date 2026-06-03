import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {IonicModule, ToastController} from "@ionic/angular";
import {ProductoService} from "../../Services/ProductoService";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-paginaeventos',
  templateUrl: './paginaeventos.component.html',
  styleUrls: ['./paginaeventos.component.scss'],
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


export class PaginaeventosComponent implements OnInit {

  carrito: any = { items: [] };
  productos: any[] = [];
  tipo: string = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private toastCtrl: ToastController,
    private carritoService: CarritoService
  ) {}

  async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'top',
      cssClass: 'custom-toast',
      icon: color === 'success' ? 'checkmark-circle' : 'alert-circle'
    });
    await toast.present();
  }

  ngOnInit() {

    const tipoRuta  = this.route.snapshot.paramMap.get("tipo") || '';

    if (tipoRuta) {
      this.tipo = tipoRuta.toLowerCase();
      this.tipo = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
    }

    this.productoService.obtenerPorTipo(tipoRuta).subscribe({
      next: (data) => {
        this.productos = data;

        if (data.length === 0) {
          this.mostrarToast('No hay productos para este tipo','warning');
        }
      },
      error: () => {
        this.mostrarToast('No se pudieron cargar los productos','danger');
      }
    });
    this.obtenerCarrito();

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
