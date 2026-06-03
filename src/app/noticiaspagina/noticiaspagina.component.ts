import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NoticiaService} from "../../Services/NoticiaService";
import {Noticia} from "../Models/Noticia";
import {CommonModule} from "@angular/common";
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CarritoService} from "../../Services/CarritoService";

@Component({
  selector: 'app-noticiaspagina',
  templateUrl: './noticiaspagina.component.html',
  styleUrls: ['./noticiaspagina.component.scss'],
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

export class NoticiaspaginaComponent implements OnInit {


  carrito: any = { items: [] };
  cargando = false;
  todos: Noticia[] = [];

  constructor(
    private noticiaService: NoticiaService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.obtenerNoticias();
    this.obtenerCarrito();

  }


  obtenerNoticias(): void {
    this.cargando = true;

    this.noticiaService.obtenerNoticias().subscribe({
      next: (data) => {
        this.todos = data;
        this.cargando = false;

        if (data.length === 0) {
          this.mostrarToast('No hay noticias disponibles','warning');
        }
      },
      error: () => {
        this.mostrarToast('No se pudieron cargar las noticias','danger');
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
