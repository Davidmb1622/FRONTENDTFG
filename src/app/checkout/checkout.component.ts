import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CarritoService} from "../../Services/CarritoService";
import {Router, RouterLink} from "@angular/router";
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {UsuarioService} from "../../Services/UsuarioService";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
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
export class CheckoutComponent  implements OnInit {

  checkoutForm!: FormGroup;
  carrito: any = { items: [] };
  envio: number = 3.95;
  total: number = 0;
  totalFinal: number = 0;
  editandoDireccion = false;
  editandoPago = false;



  direccion: any = {
    calle: '',
    ciudad: '',
    codigoPostal: ''
  };
  metodoPago: string = 'tarjeta';
  constructor(
    private fb: FormBuilder,
    private carritoService: CarritoService,
    private router: Router,
    private usuarioService: UsuarioService,
    private toastCtrl: ToastController
  ) {}
  usuario: any = {};



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

  ngOnInit() {

    this.checkoutForm = this.fb.group({
      calle: [''],
      ciudad: [''],
      codigoPostal: [''],
      direccion: [''],
      metodoPago: ['TARJETA', Validators.required]
    });

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.usuarioService.obtenerUsuario(usuarioId).subscribe(data => {
      this.usuario = data;

      this.checkoutForm.patchValue({
        direccion: this.usuario.direccion,
        metodoPago: this.usuario.metodoPago || 'TARJETA'
      });
    });

    this.obtenerCarrito();
  }


  obtenerCarrito() {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.obtenerCarrito(usuarioId).subscribe({
      next: (data) => {
        this.carrito = data;
        this.calcularTotal();

      },
      error: () => {
        this.mostrarToast('Error al cargar carrito','danger');
      }
    });
  }


  calcularTotal() {
    this.total = this.carrito.items.reduce(
      (sum: number, item: any) => sum + item.cantidad * item.precioUnitario,
      0
    );

    this.totalFinal = this.total + this.envio;
  }

  confirmarPedido() {

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    let direccion = '';

    if (this.editandoDireccion) {
      if (this.checkoutForm.get('calle')?.invalid ||
        this.checkoutForm.get('ciudad')?.invalid ||
        this.checkoutForm.get('codigoPostal')?.invalid) {

        this.mostrarToast('Completa la dirección','danger');
        return;
      }

      direccion = `${this.checkoutForm.value.calle}, ${this.checkoutForm.value.ciudad}, ${this.checkoutForm.value.codigoPostal}`;

    } else {
      direccion = this.checkoutForm.value.direccion;
    }


    const metodoPago = this.checkoutForm.value.metodoPago;

    if (!direccion || direccion.trim() === '') {
      this.mostrarToast('Completa la dirección', 'warning');
      return;
    }

    if (!metodoPago || metodoPago.trim() === '') {
      this.mostrarToast('Selecciona método de pago', 'warning');
      return;
    }

    this.carritoService.checkout(usuarioId, direccion, metodoPago).subscribe({
      next: () => {
        this.router.navigate(['/gracias']);
      },
      error: () => {
        this.mostrarToast('Error al realizar el pedido','danger');
      }
    });
  }

  guardarDireccion() {
    const calle = this.checkoutForm.value.calle;
    const ciudad = this.checkoutForm.value.ciudad;
    const codigoPostal = this.checkoutForm.value.codigoPostal;

    if (!calle || !ciudad || !codigoPostal) {
      this.mostrarToast('Completa la dirección','danger');
      return;
    }

    const direccionCompleta = `${calle}, ${ciudad}, ${codigoPostal}`;

    this.checkoutForm.patchValue({
      direccion: direccionCompleta
    });

    this.editandoDireccion = false;
  }
}
