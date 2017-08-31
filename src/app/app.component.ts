import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as uuid from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  inProcessing: boolean;

  registration: ServiceWorkerRegistration;
  controller: ServiceWorker;

  generateParams = {
    claimOnActivate: false,
    skipWaiting: false,
  };
  generatedResult: any;

  fetchTestResult = '';

  private uid = localStorage.getItem('uid');

  constructor(private http: HttpClient) {
    if (!this.uid) {
      this.uid = uuid.v4();
      localStorage.setItem('uid', this.uid);
    }
    this.finishProcessing();
    navigator.serviceWorker.addEventListener('controllerchange', (controller) => {
      this.controller = navigator.serviceWorker.controller;
    });
  }

  register() {
    this.beginProcessing();
    navigator.serviceWorker.register(`/sw.js?uid=${this.uid}`)
      .then(registration => {
        this.finishProcessing();
      });
  }

  unregister() {
    this.beginProcessing();
    navigator.serviceWorker.getRegistration()
      .then((registration: ServiceWorkerRegistration) => {
        if (registration) {
          return registration.unregister();
        }
      }).then(() => {
        this.finishProcessing();
      });
  }

  generateWorker() {
    this.beginProcessing();
    this.http.post('/generateWorker', Object.assign({}, this.generateParams, { uid: this.uid })).subscribe(resp => {
      this.generatedResult = resp;
      console.log(`generateServiceWorker:`, resp);
      this.finishProcessing();
    });
  }


  update() {
    this.beginProcessing();
    navigator.serviceWorker.getRegistration()
      .then(registration => {
        return registration.update().then(() => registration);
      })
      .then(registaration => {
        this.finishProcessing();
      });
  }

  fetchTest() {
    this.fetchTestResult = '';
    this.http.get('/test', { responseType: 'text' }).subscribe(text => {
      this.fetchTestResult = text;
    });
  }

  checkRegistration() {
    navigator.serviceWorker.getRegistration()
      .then((registration: ServiceWorkerRegistration) => {
        this.registration = registration;
      });
  }

  checkController() {
    this.controller = navigator.serviceWorker.controller;
  }

  private beginProcessing() {
    this.inProcessing = true;
  }
  private finishProcessing() {
    this.checkRegistration();
    this.checkController();
    setTimeout(() => {
      this.inProcessing = false;
    }, 600);
  }
}
