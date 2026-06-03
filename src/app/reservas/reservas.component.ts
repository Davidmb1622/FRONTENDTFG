import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ReservaService} from "../../Services/ReservaService";
import {CrearReserva} from "../Models/CrearReserva";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss'],
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

export class ReservasComponent implements OnInit {


  tallaSeleccionada: string = '';
  productoId!: number;
  carrito: any = { items: [] };

  reservas: any[] = [];

  comentario: string = '';
  fechaHora: string = '';

  minFecha: string = '';
  horasDisponibles: number[] = [];

  constructor(
    private reservaService: ReservaService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tallaSeleccionada = params['talla'] || '';
      this.productoId = Number(params['productoId']);
    });

    const ahora = new Date();
    this.minFecha = ahora.toISOString();

    this.horasDisponibles = Array.from({ length: 11 }, (_, i) => i + 10);

    this.cargarReservas();
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

  cargarReservas(): void {
    this.reservaService.obtenerTodasReservas().subscribe({
      next: (data) => {
        this.reservas = data;
      }
    });
  }

  crearReserva(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    if (!usuarioId) {
      this.mostrarToast('No hay usuario logueado', 'danger');
      return;
    }

    if (!this.tallaSeleccionada) {
      this.mostrarToast('Selecciona una talla', 'warning');
      return;
    }

    const fecha = new Date(this.fechaHora);
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();

    if (minutos !== 0) {
      this.mostrarToast('Solo se permiten horas en punto', 'warning');
      return;
    }

    if (hora < 10 || hora >= 21) {
      this.mostrarToast('Horario no válido (10:00 - 21:00)', 'warning');
      return;
    }

    const ocupada = this.reservas.some(r => {
      const rFecha = new Date(r.fechaHora);
      return rFecha.getFullYear() === fecha.getFullYear() &&
        rFecha.getMonth() === fecha.getMonth() &&
        rFecha.getDate() === fecha.getDate() &&
        rFecha.getHours() === hora;
    });

    if (ocupada) {
      this.mostrarToast('Esa hora ya está ocupada', 'danger');
      return;
    }

    const nuevaReserva: CrearReserva = {
      usuarioId,
      productoId: this.productoId,
      fechaHora: this.fechaHora,
      comentarios: this.comentario,
      talla: this.tallaSeleccionada
    };

    this.reservaService.crearReserva(nuevaReserva).subscribe({
      next: async () => {
        await this.mostrarToast('Reserva realizada con éxito', 'success');
        this.router.navigate(['/iniciopagina']);
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'No se pudo crear la reserva', 'danger');
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
