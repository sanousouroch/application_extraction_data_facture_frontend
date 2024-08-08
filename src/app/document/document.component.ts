import { Component, OnInit,Input,Output, output } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgFor,NgIf} from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DetailDocumentComponent } from '../detail-document/detail-document.component';
import { DataService } from '../service/DataService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'console';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [NgFor,RouterLink,DetailDocumentComponent,NgIf,NgbPaginationModule,NgClass,MatIconModule,MatButtonModule],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent implements OnInit{
  documents: any[] = [];
  item: any[] = [];
  items: any[] = [];
  data: any[] = [];
  detail: any[] = [];
  selectedDocumentUrl: SafeResourceUrl | null = null;

  currentDate!: string;
  token_access!: any;
 
  public page =1;
  public pageSize=15;

  pagedFacture: any[] = [];
  user:any
  historics: any[] = [];

  @Output() listeData: any;
  documentType!: any;

  constructor(private sanitizer: DomSanitizer,private service: ExtractionServiceService,private dataService: DataService, private route: ActivatedRoute,private router:Router) { 
    this.user = this.service.getUser();
  }

  ngOnInit(): void {
    this.onLoad();
    
  }

  updatePagedData() {
    if(this.documents){
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedFacture = this.documents.slice(startIndex, endIndex);
    }
    else{
      this.pagedFacture=[];
    }
    
  }

  onLoad()
  {
    
    this.service.getDocuments().subscribe((data) => {
      this.documents = data;
      this.updatePagedData();
    });
    
  }

  getItemDocument(itemId:string){
      if (itemId) {
        this.service.getItemByDocuments(itemId).subscribe(data => {
          this.item = data;
          console.log(data);
          this.dataService.changeItem(data);
          this.viewDocument(itemId);
          this.router.navigate(['/detail']);
        });
      }
  }

  getItemFacture(itemId:string){
    if (itemId) {
      this.service.getItemsFacture(itemId).subscribe(data => {
        this.data = data;
        console.log(data);
        this.dataService.changeItem(data);
        this.viewDocument(itemId);
        this.router.navigate(['/item']);
      });
    }
}

  getItems(){
      this.service.getItemsInvoice().subscribe(data => {
        this.items = data;
        this.dataService.getItemFacture(data); 
        this.updatePagedData();
        this.router.navigate(['/data']); 
  });
}

viewDocument(key: string): void {
  this.service.getDocument(key).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    
    // Déterminez le type de document basé sur la clé
    

    if (key.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i)) {
     this.documentType = 'image';
    } else if (key.match(/\.pdf$/i)) {
      this.documentType = 'pdf';
    } else {
      this.documentType = 'unknown'; // Valeur par défaut si le type n'est pas reconnu
    }

    // Mettez à jour le service partagé avec l'URL et le type
    this.dataService.changeDocument(safeUrl,this.documentType);
    console.log('Generated URL:', safeUrl); // Log de débogage
    console.log('Document type:', this.documentType); // Log du type pour débogage
  });
}


getCurrentDate(): string {
  const currentDate = new Date();
  return currentDate.toISOString();
}


logout() {
  this.service.clearUser();
  localStorage.clear();

  this.currentDate =this.getCurrentDate();

  this.token_access = localStorage.getItem('accessToken')?.toString();
  this.service.savetoken(this.currentDate,this.token_access).subscribe(
    response => {
      this.router.navigate(['/']);
    },
    error =>{
    }
  )
  
}

isActive(route: string): boolean {
  return this.router.url === route;
}



}
