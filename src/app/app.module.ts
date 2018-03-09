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
import { SearchComponent } from './place/naver/search/search.component';
import { PlaceService } from './place/naver/place.service';
import { PlaceDialogComponent } from './place/naver/place-dialog/place-dialog.component';

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
    SearchComponent,
    PlaceDialogComponent
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
  entryComponents: [
    PlaceDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
