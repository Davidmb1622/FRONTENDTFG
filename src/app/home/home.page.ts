import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule, LoadingController} from '@ionic/angular';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginService} from "../../Services/LoginService";
import {Login} from "../Models/Login";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    IonicModule, CommonModule, FormsModule, ReactiveFormsModule,HttpClientModule
  ],
  providers:[LoginService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
@Injectable({
  providedIn: 'root'
})

export class HomePage {


  login: Login = new Login();
  loginForm: FormGroup;
  loginViewFlag: boolean = true;



  constructor( private loginService: LoginService, private router: Router, private fb: FormBuilder, private loadingCtrl: LoadingController) {

    this.loginForm = this.fb.group({
      email: [this.login.email, Validators.required],
      password: [this.login.password, Validators.required],


    });
  }

  ngOnInit() {
  }

  async doLogin(): Promise<void> {
    if (!this.loginForm.valid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      backdropDismiss: false
    });
    await loading.present();

    this.loginService.login(this.loginForm.value).subscribe({
      next: async (respuesta) => {

        this.loginService.guardarSesion(respuesta);

        await loading.dismiss();
        this.router.navigate(['/presentacion']);
      },
      error: async (e) => {
        await loading.dismiss();
        if (e.status === 401) {
          alert('Correo electrónico o contraseña incorrectos.');
          return;
        }
        if (e.status === 403) {
          alert('Cuenta no verificada. Regístrate o verifica tu cuenta.');
        }
        console.error(e);
      }
    });
  }




}

