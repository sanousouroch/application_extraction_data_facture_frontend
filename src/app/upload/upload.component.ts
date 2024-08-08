import { Component, OnInit } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgIf } from '@angular/common';
import { Location } from '@angular/common'; 
import { DataService } from '../service/DataService';
import { Router } from '@angular/router';
import { DocumentComponent } from '../document/document.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [NgIf,DocumentComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit{

  selectedFile: File | null = null;
  uploadResponse: string | null = null;
  draggingOver: boolean = false;
  load = false;
  response:any;

  items: any[] = [];
  user:any
  currentDate!: string;
  idFacture!:string

  item: any[] = [];
  selectedDocumentUrl: SafeResourceUrl | null = null;
  documentType!: any;

  constructor(private service:ExtractionServiceService,private location:Location,private dataService: DataService,private router:Router,private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.user = this.service.getUser();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.type === 'application/pdf' || 'application/png' || 'application/jpg' || 'application/jpeg') {
        this.selectedFile = file;
        console.log(file.name);
      } else {
        this.uploadResponse = 'Please select a PDF file.';
      }
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

  onUpload() {
    if (this.selectedFile) {
      this.user = this.service.getUser();
      this.load = true;
      const uploadData = new FormData();
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
      const fichier = this.selectedFile.name;
      this.idFacture=this.selectedFile.name
      this.currentDate = this.getCurrentDate();
      
      this.service.uploadFacture(uploadData, this.user.idUser).subscribe({
        next: (response) => {
          this.service.addHistoric(this.currentDate,this.user.idUser,fichier,"Extraire","OK").subscribe({
            next:(reponse) =>{

              if(response==="L'extraction de données a été déjà fait avec cette facture") {
                if(this.user.role=="ADMIN")
                  {
                    this.uploadResponse = "L'extraction de données a été déjà fait avec cette facture";
                    setTimeout(() => {
                      this.router.navigate(['/data']);;
                    }, 1000);
                  
                  }
                else if(this.user.role=="USER"){
                  this.uploadResponse = "L'extraction de données a été déjà fait avec cette facture";
                  setTimeout(() => {
                    this.router.navigate(['/data']);
                  }, 1000);
                }
              } else {
                
                if(this.user.role=="ADMIN")
                  {
                    this.uploadResponse = 'Extraction réussie';
                    setTimeout(() => {
                     // this.router.navigate(['/data']);
                      this.getItemDocument(this.idFacture);
                    }, 1000);
                  
                  }
                else if(this.user.role=="USER"){
                  this.uploadResponse = 'Extraction réussie';
                  setTimeout(() => {
                   // this.router.navigate(['/data']);
                   this.getItemDocument(this.idFacture);
                  }, 1000);
                }
              }

            }
          })
         
        },
        error: (error) => {
          this.service.addHistoric(this.currentDate,this.user.idUser,fichier,"Extraire","Pas OK").subscribe({
            next:(reponse) =>{
              this.uploadResponse = 'Extraction échouée';
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          })
         
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }


  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file instanceof File) {
        this.selectedFile = file;
        this.draggingOver = false;
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver = false;
  }

  getItems(){
    this.service.getItemsInvoice().subscribe(data => {
      this.items = data;
      this.dataService.getItemFacture(data); 
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

getItemDocument(itemId:string){
  if (itemId) {
    this.service.getItemByDocuments(itemId).subscribe(data => {
      this.item = data;
      this.dataService.changeItem(data);
      this.viewDocument(itemId);
      this.router.navigate(['/new-extraction']);
    });
  }
}


}
