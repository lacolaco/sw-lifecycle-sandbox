import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdTabsModule, MdProgressBarModule } from '@angular/material';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdProgressBarModule,
    MdTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
