import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },

  {
    path: 'verificar-cuenta',
    loadComponent: () => import('./verificacion/verificacion.component').then((m) => m.VerificacionComponent),
  },

  {
    path:'eventos/:tipo',
    loadComponent: () => import('./paginaeventos/paginaeventos.component').then(m => m.PaginaeventosComponent)
  },
  {
    path: 'presentacion',
    loadComponent: () => import('./presentacion/presentacion.component').then((m) => m.PresentacionComponent),
  },

  {
    path: 'iniciopagina',
    loadComponent: () => import('./iniciopagina/iniciopagina.component').then((m) => m.IniciopaginaComponent),
  },

  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./productodetalle/productodetalle.component').then(m => m.ProductodetalleComponent)
  },

  {
    path:'trajes',
    loadComponent: () => import('./trajes/trajes.component').then(m => m.TrajesComponent)
  },

  {
    path:'reservas',
    loadComponent: () => import('./reservas/reservas.component').then(m => m.ReservasComponent)
  },

  {
    path:'carrito',
    loadComponent: () => import('./carritopagina/carritopagina.component').then(m => m.CarritopaginaComponent)
  },

  {
    path:'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path:'gracias',
    loadComponent: () => import('./graciaspagina/graciaspagina.component').then(m => m.GraciaspaginaComponent)
  },

  {
    path:'perfil',
    loadComponent: () => import('./perfilusuario/perfilusuario.component').then(m => m.PerfilusuarioComponent)
  },

  {
    path:'admin',
    loadComponent: () => import('./perfiladmin/perfiladmin.component').then(m => m.PerfiladminComponent)
  },

  {
    path:'noticias',
    loadComponent: () => import('./noticiaspagina/noticiaspagina.component').then(m => m.NoticiaspaginaComponent)
  }


];
