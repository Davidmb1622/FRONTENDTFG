import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {PedidoService} from "../../Services/PedidoService";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ToastController, AlertController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {UsuarioService} from "../../Services/UsuarioService";
import {ReservaService} from "../../Services/ReservaService";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.component.html',
  styleUrls: ['./perfilusuario.component.scss'],
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

export class PerfilusuarioComponent implements OnInit {


  pedidos: any[] = [];
  usuario: any = {};
  reservas: any[] = [];


  seccion: string = 'pedidos';
  direccion: any = { calle: '', ciudad: '', codigoPostal: '' };
  metodoPago: string = 'tarjeta';

  pedidoEditando: number | null = null;
  nuevaDireccion: string = '';
  editandoDatos = false;
  editandoDireccion = false;
  editandoPago = false;
  carrito: any = { items: [] };

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private reservaService: ReservaService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.obtenerPedidos();
    this.cargarUsuario();
    this.obtenerReservas();
    this.direccion = JSON.parse(localStorage.getItem('direccion') || '{}');
    this.metodoPago = localStorage.getItem('metodoPago') || '';

    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
      this.router.navigate(['/home']);
    }

    this.obtenerCarrito();

  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2200,
      color,
      position: 'top',
      cssClass: 'custom-toast',
      icon: color === 'success' ? 'checkmark-circle' : 'close-circle'
    });

    await toast.present();
  }

  async confirmar(mensaje: string, accion: () => void) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: mensaje,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: accion }
      ]
    });
    await alert.present();
  }

  cancelarReserva(reservaId: number): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.confirmar('¿Cancelar reserva?', () => {
      this.reservaService.cancelarReservaUsuario(reservaId,usuarioId).subscribe({
        next: () => {
          this.mostrarToast('Reserva cancelada');
          this.obtenerReservas();
        },
        error: () => {
          this.mostrarToast('Error al cancelar reserva','danger');
        }
      });
    });
  }

  cargarUsuario(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    this.usuarioService.obtenerUsuario(usuarioId).subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuario.metodoPago = this.usuario.metodoPago
          ? this.usuario.metodoPago.toUpperCase()
          : this.metodoPago;
      }
    });
  }

  obtenerReservas(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    this.reservaService.obtenerReservasUsuario(usuarioId).subscribe({
      next: (data) => this.reservas = data
    });
  }

  cerrarSesion() {
    this.confirmar('¿Seguro que quieres cerrar sesión?', () => {
      localStorage.clear();
      this.router.navigate(['/home']);
    });
  }

  obtenerPedidos(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    this.pedidoService.obtenerPedidos(usuarioId).subscribe({
      next: (data) => this.pedidos = data
    });
  }

  cancelarPedido(pedidoId: number): void {
    this.confirmar('¿Cancelar pedido?', () => {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: () => {
          this.mostrarToast('Pedido cancelado');
          this.obtenerPedidos();
        },
        error: () => {
          this.mostrarToast('Error al cancelar pedido','danger');
        }
      });
    });
  }

  puedeCancelar(fechaPedido: string): boolean {

    const fecha = new Date(fechaPedido);
    const ahora = new Date();

    const diferenciaHoras =
      (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60);

    return diferenciaHoras <= 24;
  }

  guardarPerfil() {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.usuarioService.actualizarUsuario(usuarioId, this.usuario).subscribe({
      next: () => {
        this.mostrarToast('Datos actualizados');
        this.editandoDatos = false;
        this.editandoDireccion = false;
        this.editandoPago = false;
      },
      error: () => {
        this.mostrarToast('Error al guardar','danger');
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
