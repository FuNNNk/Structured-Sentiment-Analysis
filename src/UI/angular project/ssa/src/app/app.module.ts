import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { UploadTextComponent } from './upload-text/upload-text.component';
import { GetResultsComponent } from './get-results/get-results.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadDocumentComponent,
    UploadTextComponent,
    GetResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
