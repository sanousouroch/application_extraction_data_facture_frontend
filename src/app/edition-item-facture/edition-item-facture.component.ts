import { Component,Input, OnInit} from '@angular/core';
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

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edition-item-facture',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterModule, MatSnackBarModule],
  templateUrl: './edition-item-facture.component.html',
  styleUrl: './edition-item-facture.component.scss'
})
export class EditionItemFactureComponent implements OnInit{

  @Input() designation: any;
  itemForm!: FormGroup;
  response: any;
  Id!: string;
  Index!: Number;
  data: any[] = [];
  user:any;
  documentUrl: any;
  currentDate!: string;

  constructor(private route:ActivatedRoute,private dataService: DataService, private location: Location, private service: ExtractionServiceService, private router: Router,private fb: FormBuilder,private snackBar: MatSnackBar, private dialogue:NgbModal) { 
  
  }

  isImage(url: string): boolean {
    return url.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) !== null;
  }

  // Méthode pour vérifier si l'URL est un PDF
  isPDF(url: string): boolean {
    return url.match(/\.pdf$/i) !== null;
  }
  
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

  ngOnInit(): void {
    this.dataService.currentDocument.subscribe(url => this.documentUrl = url);
    this.route.paramMap.subscribe(params => {
      this.Id = params.get('Id')!;
      this.Index = Number(params.get('itemId'));
     
    });

    this.user = this.service.getUser();
    this.dataService.currentItem.subscribe(data => {
      this.designation = data;
      //console.log(this.designation.QUANTITY)
      this.itemForm = this.fb.group({
        Id: [this.Id || '', Validators.required],
        ITEM: [this.designation?.ITEM || '', Validators.required],
        PRICE: [this.designation?.PRICE || '', Validators.required],
        QUANTITY: [this.designation?.QUANTITY || '', Validators.required],
        Index: [this.Index, Validators.required],
        idUser:this.user.idUser
      });
    });
  
 
  }

 
  goBack() {
    this.router.navigate(['/document'])
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.user = this.service.getUser();
      const { Id, Index, ITEM, PRICE, QUANTITY,idUser } = this.itemForm.value;
      this.currentDate = this.getCurrentDate();
      this.service.updateInvoiceItem(Id, Index, ITEM, PRICE, QUANTITY,idUser).subscribe({
        next: (response) => {
          this.service.addHistoric(this.currentDate,this.user.idUser,Id,"Modification des désignations","OK").subscribe({
            next:(reponse) => {
              this.response= "Modification réussie"
          
              setTimeout(() => {
                this.getItemFacture(Id);
              }, 1000);
            }
          })
         
        },
        error: (error) => {
           this.response= "Modification échouée"
          this.service.addHistoric(this.currentDate,this.user.idUser,Id,"Modification des désignations","Pas OK").subscribe({
            next:(reponse) =>{

              setTimeout(() => {
                this.getItemFacture(Id);
              }, 1000);
            }
          })
         
        }
    });
  }
}
  


  getItemFacture(itemId:String){
    if (itemId) {
      this.service.getItemsFacture(itemId).subscribe(data => {
        this.data = data;
        this.dataService.changeItem(data); // Stocke les données dans le service
        this.router.navigate(['/item']);
      });
    }
}
  

}
