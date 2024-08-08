import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { Location } from '@angular/common'; 
import { DataService } from '../service/DataService';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EditDetailFactureComponent } from '../edit-detail-facture/edit-detail-facture.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-detail-document',
  standalone: true,
  imports: [NgIf,EditDetailFactureComponent,RouterLink],
  templateUrl: './detail-document.component.html',
  styleUrl: './detail-document.component.scss'
})
export class DetailDocumentComponent implements OnInit{
  item: any;
  data: any[] = [];
  url:any
  selectedDocumentUrl: SafeResourceUrl | null = null;
  documentUrl: any;
  documentType: 'image' | 'pdf' | null = null; // Type du document
  user:any;
  
  //const bindings = require('../build/Release/canvas.node')

  ngOnInit(): void {
    
    this.user = this.service.getUser();
    this.dataService.currentItem.subscribe(data => {
      this.item = data;
    });
    this.dataService.currentDocument.subscribe(data => {
      if (data) {
        this.documentUrl = data.document; // URL du document
        this.documentType = data.type; // Type du document
        console.log('Document URL:', this.documentUrl); // Log pour débogage
        console.log('Document Type:', this.documentType); // Log pour débogage
      } else {
        console.warn('Data is null or undefined'); // Avertir si les données sont null
      }
    });
    //this.renderPDF();
  }

  goBack() {
    this.router.navigate(['/document'])
  }

  goToBack() {
    this.router.navigate(['/facture'])
  }

  constructor(private sanitizer: DomSanitizer,private dataService: DataService, private location: Location, private service: ExtractionServiceService, private router: Router ) { 

  }

  
getItemEdition(itemId:String){
  if (itemId) {
    this.service.getItemFacturePDF(itemId).subscribe(data => {
      this.item = data;
      this.dataService.changeItemFacture(data); // Stocke les données dans le service
      this.router.navigate(['/edit']);
    });
  }
}



  
}
