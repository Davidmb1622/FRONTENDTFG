import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {IonicModule, LoadingController, ToastController} from "@ionic/angular";
import { HttpClientModule } from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {RegistroService} from "../../Services/RegistroService";
import {Router} from "@angular/router";
import { NavController } from '@ionic/angular';
import {Registro} from "../Models/Registro";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
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
export class RegistroComponent implements OnInit {



  registroForm: FormGroup;
  registro: Registro = new Registro();
  loginViewFlag: boolean = true;

  constructor(
    private registroService: RegistroService,
    private fb: FormBuilder,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) {
    this.registroForm = this.fb.group({
      nombre: [this.registro.nombre, Validators.required],
      email: [this.registro.email, Validators.required],
      password: [
        this.registro.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
        ]
      ],
      telefono: [this.registro.telefono, Validators.required],
    });
  }

  ngOnInit() {}


  private getErrorMensaje(): string {

    const form = this.registroForm;

    if (form.get('nombre')?.hasError('required')) {
      return 'El nombre es obligatorio';
    }

    if (form.get('email')?.hasError('required')) {
      return 'El email es obligatorio';
    }

    if (form.get('email')?.hasError('email')) {
      return 'El email no es válido';
    }

    if (form.get('password')?.hasError('required')) {
      return 'La contraseña es obligatoria';
    }

    if (form.get('password')?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    if (form.get('password')?.hasError('pattern')) {
      return 'Debe tener mayúscula, minúscula y número';
    }

    if (form.get('telefono')?.hasError('required')) {
      return 'El teléfono es obligatorio';
    }

    return 'Formulario inválido';
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

  async doRegister() {

    if (!this.registroForm.valid) {
      const mensaje = this.getErrorMensaje();
      this.mostrarToast(mensaje, 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent',
      backdropDismiss: false
    });

    await loading.present();

    this.registroService.registrar(this.registroForm.value).subscribe({
      next: async () => {
        await loading.dismiss();
        this.mostrarToast('Cuenta creada correctamente', 'success');
        this.navCtrl.navigateRoot('/verificar-cuenta');
      },
      error: async (err) => {
        await loading.dismiss();
        this.mostrarToast(err.error?.message || 'Error en el registro', 'danger');
      }
    });
  }

}
