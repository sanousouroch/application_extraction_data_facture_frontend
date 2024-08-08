import { Component, OnInit } from '@angular/core';
import { ViewChild,ElementRef } from '@angular/core';
import { NgIf,NgFor } from '@angular/common';
import { Location } from '@angular/common'; 
import { DataService } from '../service/DataService';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExportService } from '../service/export.service';

@Component({
  selector: 'app-one-facture',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './one-facture.component.html',
  styleUrl: './one-facture.component.scss'
})
export class OneFactureComponent implements OnInit{

  item: any[] = [];
  selectedDocumentUrl: SafeResourceUrl | null = null;
  data: any;
  designation:any;
  documentUrl: any;
  user:any

 @ViewChild('dataTable') dataTable: ElementRef;

 documentType: 'image' | 'pdf' | null = null; // Type du document

 constructor(private dataService: DataService, private location: Location, private router:Router,private exportService: ExportService, private service:ExtractionServiceService) { 
  this.dataTable = ElementRef.prototype
}

  ngOnInit(): void {
    this.user = this.service.getUser();
    this.dataService.currentItem.subscribe(data => {
      this.data = data;
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
  }

  goBack() {
    this.router.navigate(['/document'])
  }

  goToBack() {
    this.router.navigate(['/facture'])
  }

  

  exportElmToExcel(): void {
    this.exportService.exportTableElmToExcel(this.dataTable, 'facture_data');
  }

  extractNumbers(str: string): string {
    // Remplace tous les caractères non numériques par une chaîne vide
    return str.replace(/[^\d.]/g, '');
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
