import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { register } from 'swiper/element/bundle';
import {jwtInterceptor} from "./Services/jwt.interceptor";
import {addIcons} from "ionicons";
import {cartOutline, chevronDownOutline, personOutline, searchOutline, settingsOutline} from "ionicons/icons";


register();
addIcons({
  'cart-outline': cartOutline,
  'person-outline': personOutline,
  'search-outline': searchOutline,
  'chevron-down-outline': chevronDownOutline,
  'settings-outline': settingsOutline
});
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),

    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ],
});
