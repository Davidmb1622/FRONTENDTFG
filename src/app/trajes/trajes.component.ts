import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ProductoService} from "../../Services/ProductoService";
import {Producto} from "../Models/Producto";
import { ActivatedRoute } from '@angular/router';
import {OllamaService} from "../../Services/OllamaService";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-trajes',
  templateUrl: './trajes.component.html',
  styleUrls: ['./trajes.component.scss'],
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
export class TrajesComponent implements OnInit {


  todos: Producto[] = [];
  cargando = false;
  error = '';
  textoBusqueda: string = '';
  filtros: any = {};
  chatAbierto = false;
  carrito: any = { items: [] };

  mensajeUsuario = '';
  mensajes: any[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private ollamaService: OllamaService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private carritoService: CarritoService
  ) {}

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

  colores = [
    { nombre: 'BLANCO', hex: '#FFFFFF' },
    { nombre: 'GRIS', hex: '#BEBEBE' },
    { nombre: 'NEGRO', hex: '#000000' },
    { nombre: 'AZUL', hex: '#1E90FF' },
    { nombre: 'ROSA', hex: '#FFC0CB' },
    { nombre: 'AZULMARINO', hex: '#001F3F' },
    { nombre: 'NARANJA', hex: '#FF8C00' }
  ];

  colorSeleccionado: string | null = null;
  mostrarFiltros: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const texto = params['texto'];

      if (texto) {
        this.filtros = {};
        this.colorSeleccionado = null;
        this.textoBusqueda = texto;

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });

        this.buscarProductos();
      } else {
        this.obtenerTodos();
      }
    });
    this.obtenerCarrito();

  }

  obtenerTodos(): void {
    this.cargando = true;
    this.error = '';

    this.productoService.obtenerTodos().subscribe({
      next: (data) => {
        this.todos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos';
        this.cargando = false;
        this.mostrarToast('No se pudieron cargar los productos', 'danger');
      }
    });
  }

  setFiltro(clave: string, event: any) {
    const valor = event.detail.value;

    if (clave === 'talla') delete this.filtros['tallanumerica'];
    if (clave === 'tallanumerica') delete this.filtros['talla'];

    this.filtros[clave] = valor;
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  buscarProductos(): void {
    this.cargando = true;
    this.error = '';

    const params: any = {};

    if (this.textoBusqueda && Object.keys(this.filtros).length === 0) {
      params.q = this.textoBusqueda;
    }

    Object.keys(this.filtros).forEach(key => {
      if (this.filtros[key]) params[key] = this.filtros[key];
    });

    this.productoService.buscar(params).subscribe({
      next: data => {

        if (data.length === 1) {
          this.router.navigate(['/producto', data[0].id]);
          return;
        }

        this.todos = data;
        this.cargando = false;
        this.mostrarFiltros = false;
        this.textoBusqueda = '';

        if (data.length === 0) {
          this.mostrarToast('No se encontraron resultados', 'warning');
        }
      },
      error: () => {
        this.error = 'Error al aplicar filtros';
        this.cargando = false;
        this.mostrarToast('Error al aplicar filtros', 'danger');
      }
    });
  }

  seleccionarColor(color: string) {
    this.colorSeleccionado = color;

    if (color) {
      this.filtros['color'] = color;
    } else {
      delete this.filtros['color'];
    }
  }

  limpiarFiltros() {
    this.filtros = {};
    this.colorSeleccionado = null;
    this.textoBusqueda = '';
    this.obtenerTodos();
    this.mostrarToast('Filtros limpiados', 'medium');
  }

  toggleChat(){
    this.chatAbierto = !this.chatAbierto;
  }

  preguntaollama(): void {

    if (!this.mensajeUsuario.trim()) {
      this.mostrarToast('Escribe una pregunta', 'warning');
      return;
    }

    const pregunta = this.mensajeUsuario;

    this.mensajes.push({
      texto: pregunta,
      tipo: 'user'
    });

    this.mensajeUsuario = '';

    this.ollamaService.preguntar(pregunta).subscribe({
      next: (res) => {
        this.mensajes.push({
          texto: res,
          tipo: 'ia'
        });
      },
      error: () => {
        this.mostrarToast('Error al consultar la IA', 'danger');
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
