import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { withFetch } from '@angular/common/http';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ExtractionServiceService } from './service/extraction-service.service';
import { routes } from './app.routes';
import { AppRoutingModule } from './app.routes';
import { DocumentComponent } from './document/document.component';
import { DetailDocumentComponent } from './detail-document/detail-document.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NumberWithSpacesPipe } from './number-with-spaces.pipe';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ExtractionServiceService,FormsModule,RouterModule,
    NgModule,BrowserModule,AppRoutingModule,DocumentComponent,DetailDocumentComponent,
  
  {provide:LocationStrategy,useClass:HashLocationStrategy}, provideAnimationsAsync(), NumberWithSpacesPipe]
};


;