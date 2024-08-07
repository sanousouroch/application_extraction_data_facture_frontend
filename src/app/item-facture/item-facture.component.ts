import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { NgIf,NgFor } from '@angular/common';
import { Location } from '@angular/common'; 
import { DataService } from '../service/DataService';
import { ExportService } from '../service/export.service';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-item-facture',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './item-facture.component.html',
  styleUrl: './item-facture.component.scss'
})
export class ItemFactureComponent implements OnInit{
 data: any;
 designation:any;
 selectedDocumentUrl: SafeResourceUrl | null = null;
 documentUrl: any;
 user:any

 @ViewChild('dataTable') dataTable: ElementRef;

  ngOnInit(): void {
    this.user = this.service.getUser();
    this.dataService.currentItem.subscribe(data => {
      this.data = data;
      console.log(data);
    });
    this.dataService.currentDocument.subscribe(url => this.documentUrl = url);
  }

  goBack() {
    this.router.navigate(['/document'])
  }

  goToBack() {
    this.router.navigate(['/facture'])
  }

  constructor(private dataService: DataService, private location: Location, private router:Router,private exportService: ExportService, private service:ExtractionServiceService) { 
    this.dataTable = ElementRef.prototype
  }

  exportElmToExcel(): void {
    this.exportService.exportTableElmToExcel(this.dataTable, 'item_facture_data');
  }

  extractNumbers(str: string): string {
    // Remplace tous les caractères non numériques par une chaîne vide
    return str.replace(/[^\d.]/g, '');
  }

  getItemEdit(Id: string, itemId: number): void {
    if (itemId !== undefined && itemId !== null) {
      this.service.getItemDataFacture(Id, itemId).subscribe(
        data => {
          this.designation = data;
          console.log(itemId);
          this.dataService.changeItemFacture(data); // Stocke les données dans le service
          this.router.navigate(['/edition',Id,itemId]);
        },
        error => {
          console.error('Erreur lors de la récupération de l\'élément :', error);
        }
      );
    }
  }


  

}
