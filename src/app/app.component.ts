import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DocumentComponent } from './document/document.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateFormatPipe } from './date-format.pipe';
import { faFileInvoice, faFileExport, faDatabase, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,DocumentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'factract';
  faFileInvoice = faFileInvoice;
  faFileExport = faFileExport;
  faDatabase = faDatabase;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
}


