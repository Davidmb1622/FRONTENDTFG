import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit,ViewChild,ElementRef,AfterViewInit} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormsModule, ReactiveFormsModule,} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ProductoService} from "../../Services/ProductoService";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CarritoService} from "../../Services/CarritoService";


@Component({
  selector: 'app-productodetalle',
  templateUrl: './productodetalle.component.html',
  styleUrls: ['./productodetalle.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@Injectable({
  providedIn: 'root'
})

export class ProductodetalleComponent implements OnInit,AfterViewInit{


  @ViewChild('swiperRef')
  swiperRef!: ElementRef;

  tallaSeleccionada: string = '';
  colorSeleccionado: string = '';
  producto: any;


  constructor(
    private productosService: ProductoService,
    private carritoService: CarritoService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngAfterViewInit() {
    this.inicializarSwiper();
  }
  carrito: any = { items: [] };
  total: number = 0;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProducto(id);
    this.obtenerCarrito();
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  obtenerColorHex(color: string): string {

    switch (color) {
      case 'BLANCO':
        return '#ffffff';

      case 'GRIS':
        return '#bdbdbd';

      case 'NEGRO':
        return '#000000';

      case 'AZUL':
        return '#1e88e5';

      case 'ROSA':
        return '#f8bbd0';

      case 'AZULMARINO':
        return '#001f54';

      case 'NARANJA':
        return '#fb8c00';

      default:
        return '#cccccc';
    }
  }

  inicializarSwiper() {

    setTimeout(() => {

      if (this.swiperRef?.nativeElement) {

        const swiperEl = this.swiperRef.nativeElement;

        swiperEl.initialize?.();

        swiperEl.swiper?.update();

      }

    }, 100);

  }

  cargarProducto(id: number): void {
    this.productosService.obtenerPorId(id).subscribe({
      next: (data) => {
        this.producto = data;

        this.inicializarSwiper();


        if (this.producto.color?.length === 1) {
          this.colorSeleccionado = this.producto.color[0];
        }
      },
      error: () => {
        this.mostrarToast('No se pudo cargar el producto', 'danger');
      }
    });
  }

  irReserva() {

    if (!this.tallaSeleccionada) {
      this.mostrarToast('Selecciona una talla', 'warning');
      return;
    }

    this.router.navigate(['/reservas'], {
      queryParams: {
        productoId: this.producto.id,
        talla: this.tallaSeleccionada
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

  agregarCarrito() {

    const usuarioId = Number(localStorage.getItem('usuarioId'));
    const productoId = this.producto.id;



    if (!usuarioId) {
      this.mostrarToast('No hay usuario logueado', 'danger');
      return;
    }

    if (!this.tallaSeleccionada) {
      this.mostrarToast('Selecciona una talla', 'warning');
      return;
    }



    if (!this.colorSeleccionado) {
      this.mostrarToast('Selecciona un color', 'warning');
      return;
    }

    this.carritoService.agregarProducto(usuarioId, productoId, 1, this.tallaSeleccionada,this.colorSeleccionado).subscribe({
      next: () => {
        this.mostrarToast('Producto añadido al carrito', 'success');
        this.obtenerCarrito();
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'Stock insuficiente de la talla seleccionada', 'danger');
      }
    });
  }

}
