import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {ProductoService} from "../../Services/ProductoService";
import {PedidoService} from "../../Services/PedidoService";
import {ReservaService} from "../../Services/ReservaService";
import {NoticiaService} from "../../Services/NoticiaService";
import {IonicModule, ToastController, AlertController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-perfiladmin',
  templateUrl: './perfiladmin.component.html',
  styleUrls: ['./perfiladmin.component.scss'],
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

export class PerfiladminComponent implements OnInit {


  productos: any[] = [];
  pedidos: any[] = [];
  reservas: any[] = [];
  carrito: any = { items: [] };

  producto: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenes: [],
    tipo: [],
    color: []
  };

  productoEditando: any = null;

  tipos = ['BODA', 'FIESTA', 'GALA', 'FERIA','FUNERAL','SEMANA_SANTA'];
  colores = ['BLANCO', 'NEGRO', 'AZUL', 'GRIS','ROSA','AZULMARINO','NARANJA'];

  tallas = ['S', 'M', 'L', 'XL', 'XXL'];
  tallasNumericas = ['EU36','EU38','EU40','EU42','EU44','EU46','EU48','EU50','EU52','EU54','EU56','EU58'];

  tallasStock: any = {};
  tallasNumericasStock: any = {};

  nuevaNoticia: any = { titulo: '', contenido: '' };
  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private reservaService: ReservaService,
    private noticiaService: NoticiaService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarPedidos();
    this.cargarReservas();
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

  cargarProductos() {
    this.productoService.obtenerTodos().subscribe(data => {
      this.productos = data;
    });
  }

  crearProducto() {
    const dto = this.prepararDTO();

    this.productoService.crear(dto).subscribe({
      next: () => {
        this.mostrarToast('Producto creado');
        this.resetFormulario();
        this.cargarProductos();
      },
      error: () => {
        this.mostrarToast('Error al crear producto','danger');
      }
    });
  }

  editarProducto(producto: any) {
    this.productoEditando = { ...producto };
  }

  guardarEdicion() {
    this.productoService
      .actualizarProducto(this.productoEditando.id, this.productoEditando)
      .subscribe({
        next: () => {
          this.mostrarToast('Producto actualizado');
          this.productoEditando = null;
          this.cargarProductos();
        },
        error: () => {
          this.mostrarToast('Error al actualizar','danger');
        }
      });
  }

  eliminarProducto(id: number) {
    this.confirmar('¿Eliminar producto?', () => {
      this.productoService.eliminar(id).subscribe({
        next: () => {
          this.mostrarToast('Producto eliminado');
          this.cargarProductos();
        },
        error: () => {
          this.mostrarToast('Error al eliminar','danger');
        }
      });
    });
  }

  prepararDTO() {
    const tallasDTO = Object.keys(this.tallasStock)
      .filter(t => this.tallasStock[t] > 0)
      .map(t => ({ talla: t, stock: this.tallasStock[t] }));

    const tallasNumericasDTO = Object.keys(this.tallasNumericasStock)
      .filter(t => this.tallasNumericasStock[t] > 0)
      .map(t => ({ tallanumerica: t, stock: this.tallasNumericasStock[t] }));

    return {
      ...this.producto,
      tallasStock: tallasDTO,
      tallasNumericasStock: tallasNumericasDTO
    };
  }

  resetFormulario() {
    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      imagen: '',
      tipo: [],
      color: []
    };
    this.tallasStock = {};
    this.tallasNumericasStock = {};
  }

  crearNoticia() {
    this.noticiaService.crearNoticia(this.nuevaNoticia).subscribe({
      next: () => {
        this.mostrarToast('Noticia creada');
        this.nuevaNoticia = { titulo: '', contenido: '' };
      },
      error: () => {
        this.mostrarToast('Error al crear noticia','danger');
      }
    });
  }

  cargarPedidos() {
    this.pedidoService.obtenerTodosPedidos().subscribe(data => {
      this.pedidos = data;
    });
  }

  cambiarEstadoPedido(pedido: any) {
    this.pedidoService
      .cambiarEstado(pedido.id, pedido.estado)
      .subscribe({
        next: () => this.mostrarToast('Estado actualizado'),
        error: () => this.mostrarToast('Error al actualizar','danger')
      });
  }

  cargarReservas() {
    this.reservaService.obtenerTodasReservas().subscribe(data => {
      this.reservas = data;
    });
  }

  cambiarEstadoReserva(reserva: any) {
    this.reservaService
      .cambiarEstado(reserva.id, reserva.estado)
      .subscribe({
        next: () => this.mostrarToast('Estado actualizado'),
        error: () => this.mostrarToast('Error al actualizar','danger')
      });
  }

  cerrarSesion() {
    this.confirmar('¿Seguro que quieres cerrar sesión?', () => {
      localStorage.clear();
      this.router.navigate(['/home']);
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

  agregarImagen() {
    this.producto.imagenes.push('');
  }

  eliminarImagen(index: number) {
    this.producto.imagenes.splice(index, 1);
  }
}
