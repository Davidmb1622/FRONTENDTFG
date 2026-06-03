import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {ProductoService} from "../../Services/ProductoService";
import {OllamaService} from "../../Services/OllamaService";
import {Producto} from "../Models/Producto";
import {FormsModule} from "@angular/forms";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-iniciopagina',
  templateUrl: './iniciopagina.component.html',
  styleUrls: ['./iniciopagina.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
    RouterLink,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
@Injectable({
  providedIn: 'root'
})


export class IniciopaginaComponent  implements OnInit {

  novedades: Producto[] = [];
  cargando = false;
  error = '';
  chatAbierto = false;

  mensajeUsuario = '';
  mensajes: any[] = [];
  carrito: any = { items: [] };


  constructor(
    private productoService: ProductoService,
    private ollamaService: OllamaService,
    private toastCtrl: ToastController,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarNovedades();
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

  cargarNovedades(): void {
    this.cargando = true;
    this.error = '';

    this.productoService.obtenerNovedades().subscribe({
      next: (data) => {
        this.novedades = data;
        this.cargando = false;
      },
      error: async () => {
        this.error = 'No se pudieron cargar las novedades';
        this.cargando = false;
        await this.mostrarToast('Error al cargar novedades', 'danger');
      }
    });
  }

  toggleChat(){
    this.chatAbierto = !this.chatAbierto;
  }

  preguntaollama(): void{

    if(!this.mensajeUsuario.trim()) return;

    const pregunta = this.mensajeUsuario;

    this.mensajes.push({
      texto: pregunta,
      tipo: 'user'
    });

    this.mensajeUsuario = '';

    this.ollamaService.preguntar(pregunta).subscribe(res => {

      this.mensajes.push({
        texto: res,
        tipo: 'ia'
      });

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
