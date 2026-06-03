import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {CarritoService} from "../../Services/CarritoService";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-carritopagina',
  templateUrl: './carritopagina.component.html',
  styleUrls: ['./carritopagina.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
@Injectable({
  providedIn: 'root'
})
export class CarritopaginaComponent  implements OnInit {


  carrito: any = { items: [] };
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.obtenerCarrito();
  }

  async mostrarToast(mensaje: string, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color
    });
    await toast.present();
  }

  obtenerCarrito() {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.obtenerCarrito(usuarioId).subscribe({
      next: (data) => {
        this.carrito = data;
        this.calcularTotal();
      },
      error: () => {
        console.error('Error al cargar carrito');
      }
    });
  }

  calcularTotal() {
    this.total = this.carrito.items.reduce(
      (sum: number, item: any) => sum + item.cantidad * item.precioUnitario,
      0
    );
  }

  eliminarProducto(productoId: number, talla: string) {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.eliminarProducto(usuarioId, productoId, talla).subscribe({
      next: async (data) => {
        this.carrito = data;
        this.calcularTotal();
        this.obtenerCarrito();
        await this.mostrarToast('Producto eliminado', 'success');
      },
      error: async () => {
        await this.mostrarToast('Error al eliminar producto', 'danger');
      }
    });
  }

  vaciarCarrito() {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.vaciarCarrito(usuarioId).subscribe({
      next: async () => {
        this.carrito.items = [];
        this.total = 0;
        this.obtenerCarrito();
        await this.mostrarToast('Carrito vaciado', 'warning');
      }
    });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  actualizarCantidad(productoId: number, talla: string, cantidad: number) {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.actualizarCantidad(usuarioId, productoId, talla, cantidad)
      .subscribe({
        next: async (data) => {
          this.carrito = data;
          this.calcularTotal();
          this.obtenerCarrito();
          await this.mostrarToast('Cantidad actualizada', 'success');
        },
        error: async () => {
          await this.mostrarToast('Error al actualizar cantidad', 'danger');
        }
      });
  }
}
