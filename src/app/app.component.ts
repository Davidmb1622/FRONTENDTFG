import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BuscadorComponent } from "./buscador/buscador.component";
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    BuscadorComponent,
    CommonModule
  ],
})
export class AppComponent {
  mostrarBuscador: boolean = true;

  constructor(private router: Router) {

    const ocultarEn = ['/home', '/registro', '/verificar-cuenta'];

    this.checkRoute(this.router.url, ocultarEn);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects, ocultarEn);
      });
  }
  private checkRoute(url: string, ocultarEn: string[]) {
    this.mostrarBuscador = !ocultarEn.some(ruta => url.startsWith(ruta));
  }
}
