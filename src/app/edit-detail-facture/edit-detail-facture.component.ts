import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Facture } from '../model-facture/Facture';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from '../service/DataService';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-detail-facture',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterModule, MatSnackBarModule],
  templateUrl: './edit-detail-facture.component.html',
  styleUrl: './edit-detail-facture.component.scss'
})
export class EditDetailFactureComponent implements OnInit{
  @Input() detail: any;
  factureForm!: FormGroup;
  response: any;
  item:any;
  user:any;
  documentUrl: any;
  currentDate!: string;
  statut!: string;
  documentType: 'image' | 'pdf' | null = null; // Type du document
  
  constructor(private dataService: DataService, private location: Location, private service: ExtractionServiceService, private router: Router,private fb: FormBuilder,private snackBar: MatSnackBar, private dialogue:NgbModal) { 
  
  }


  ngOnInit(): void {
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
    this.user = this.service.getUser();
    this.dataService.currentItem.subscribe(data => {
      this.detail = data;
      this.factureForm = this.fb.group({
        Id: [this.detail?.Id || '', Validators.required],
        VENDOR_NAME: [this.detail?.VENDOR_NAME || '',Validators.required],
        INVOICE_RECEIPT_ID: [this.detail?.INVOICE_RECEIPT_ID || '', Validators.required],
        INVOICE_RECEIPT_DATE: [this.detail?.INVOICE_RECEIPT_DATE || '', Validators.required],
        TOTAL_INVOICE_RECEIPT_DATE: [this.detail?.TOTAL_INVOICE_RECEIPT_DATE || '', Validators.required],
        CURRENCY: [this.detail?.CURRENCY || '', Validators.required],
        TauxDeChange_INVOICE_RECEIPT_DATE: [this.detail?.TauxDeChange_INVOICE_RECEIPT_DATE || '', Validators.required],
        TOTAL_INVOICE_RECEIPT_DATE_FCFA: [this.detail?.TOTAL_INVOICE_RECEIPT_DATE_FCFA || '', Validators.required],
        DUE_DATE: [this.detail?.DUE_DATE || '', Validators.required],
        TauxDeChange_DUE_DATE: [this.detail?.TauxDeChange_DUE_DATE || '', Validators.required],
        TOTAL_DUE_DATE_FCFA: [this.detail?.TOTAL_DUE_DATE_FCFA || '', Validators.required],
        ADDRESS: [this.detail?.ADDRESS || '', Validators.required],
        idUser:this.user.idUser
      });
    });
    
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }


  onSubmit(): void {
    if (this.factureForm.invalid) {
      return;
    }
    
    const factureData = this.factureForm.value;
    const id = factureData.Id;
    this.currentDate = this.getCurrentDate();
    console.log(this.currentDate)
    this.statut="OK"
    this.service.updateDataFacture(id, factureData).subscribe({
      next: (response) => {
        this.service.addHistoric(this.currentDate,this.user.idUser,factureData.Id,'Modification des details',this.statut).subscribe({
          next:(reponse)=>{
           // console.log(reponse);
            this.response = `Facture ` + id + ' mis à jour avec succès';
      
            setTimeout(() => {
              this.getItemDocument(id);
            }, 1000);
          }
        })
      },
      error: (error) => {
        this.service.addHistoric(this.currentDate,this.user.idUser,factureData.Id,'Modification des détails',this.statut).subscribe({
          next:(reponse)=>{
           // console.log(reponse);
            this.response = `Facture ` + id + ' mise à jour échouée';
      
            setTimeout(() => {
              this.getItemDocument(id);
            }, 1000);
          }
        })
      }
  });
    
  }

  getItemDocument(itemId:String){
    if (itemId) {
      this.service.getItemByDocuments(itemId).subscribe(data => {
        this.item = data;
        this.dataService.changeItem(data); // Stocke les données dans le service
        this.router.navigate(['/detail']);
      });
    }
}

goBack() {
  this.router.navigate(['/document'])
}


}
