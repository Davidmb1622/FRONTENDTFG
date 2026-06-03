import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsuarioService} from "../../Services/UsuarioService";
import {Router} from "@angular/router";
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

@Injectable({
  providedIn: 'root'
})
export class VerificacionComponent implements OnInit {



  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      codigoVerificacion: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

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

  verificarCodigo() {
    if (this.form.invalid) {
      this.mostrarToast('Introduce un código válido', 'warning');
      return;
    }

    this.loading = true;

    this.usuarioService.verificarCodigo(
      this.form.value.codigoVerificacion
    ).subscribe({
      next: async () => {
        this.loading = false;
        await this.mostrarToast('Cuenta verificada correctamente', 'success');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.loading = false;
        this.mostrarToast('Código inválido o expirado', 'danger');
      }
    });
  }
}
