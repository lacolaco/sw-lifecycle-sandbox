import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    console.log(registration);
  })
  .catch(error => {
    console.error(error);
  });
