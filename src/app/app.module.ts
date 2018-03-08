import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { SearchComponent } from './place/search/search.component';
import { PlaceService } from './place/place.service';

const materialModules = [
  BrowserAnimationsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatListModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    materialModules
  ],
  providers: [
    PlaceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
