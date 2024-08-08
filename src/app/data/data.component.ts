import { Component, OnInit, ViewChild,ElementRef,Input} from '@angular/core';
import { Location } from '@angular/common'; 
import { DataService } from '../service/DataService';
import { NgFor,NgIf } from '@angular/common';
import { ExportService } from '../service/export.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ExtractionServiceService } from '../service/extraction-service.service';
import * as XLSX from 'xlsx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaiementComponent } from '../paiement/paiement.component';
import { Output } from '@angular/core';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-data',
  standalone: true,
  imports: [NgFor,NgbPaginationModule,NgIf,ReactiveFormsModule,NgClass],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent implements OnInit{
  items:any[] = [];
  donnees :any[] = [];

  public page =1;
  public pageSize=15;
  user:any
  item:any;
  data:any;
  supplierForm!: FormGroup;
  suppliers: any[] = [];
  invoices = [];
  selectedSupplier!:string;
  totalFacture:any;
  nombreFacturePayee=0;
  nombreFactureImpaye=0;
  montantTotalFacture=0;
  montantTotalFacturePayee=0;
  montantTotalFactureImpaye=0;
  uniqueSuppliers: any[] = [];

  @Output() idFacture: any;


  @ViewChild('dataTable') dataTable: ElementRef;
 

  pagedFacture: any[] = [];

  documentType!: any;
  

  constructor(private fb: FormBuilder,private dataService: DataService, private location: Location, private exportService: ExportService,private router:Router,private service: ExtractionServiceService,private sanitizer: DomSanitizer,private dialogRef:NgbModal) { 
    this.dataTable = ElementRef.prototype;
    this.supplierForm = this.fb.group({
      supplier: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.onLoad(); 
    this.user = this.service.getUser();
    this.loadSuppliers();
   
  }

  updatePagedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedFacture = this.items.slice(startIndex, endIndex);
  }



  onLoad()
  {
    this.user = this.service.getUser();

    if(this.user.role=="ADMIN")
      {
        this.getDataFcture();
      }
    else if(this.user.role=="USER")
        {
            this.getItems();
      }

    
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

  openDialog(idFacture: string,dateEcheance:string)
  {
    //this.dialogRef.open(ActivateUserComponent);
   
    const modalRef = this.dialogRef.open(PaiementComponent);
    modalRef.componentInstance.idFacture = idFacture;
    modalRef.componentInstance.dateEcheance = dateEcheance;

    //idFacture=idFacture;
  
  }

  formatNumberWithSpaces(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }
  
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) {
      return value.toString(); // Return the original value if it's not a number
    }
  
    // Convert the number to a string and format it with spaces
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  onSupplierChange() {
    this.montantTotalFacture =0;
    this.montantTotalFacturePayee=0;
    this.montantTotalFactureImpaye=0;
     this.selectedSupplier = this.supplierForm.get('supplier')?.value;
    this.service.getVendorByName(this.selectedSupplier).subscribe(data => {
      this.items = data;
      this.totalFacture=data.length;
     // console.log(this.totalFacture);
      //console.log(data[0].datePaiement);
      for (let i = 0; i < data.length; i++) {
        const donnee = data[i];
       
        console.log(this.montantTotalFacture);
        if(donnee.datePaiement)
          {
            this.montantTotalFacture =  this.items.filter(donnee => donnee.datePaiement).reduce((total, invoice) => total + invoice.TOTAL_DUE_DATE_FCFA, 0);
            this.nombreFacturePayee = this.items.filter(donnee => donnee.datePaiement).length;
            console.log(this.nombreFacturePayee);
            this.montantTotalFacturePayee =  this.items.filter(donnee => donnee.datePaiement).reduce((total, invoice) => total + invoice.MontantPayer, 0);
            console.log(this.montantTotalFacturePayee)
            
          }else{
            this.nombreFactureImpaye = this.items.filter(donnee => !donnee.datePaiement).length;
            console.log(this.nombreFactureImpaye);
            this.montantTotalFactureImpaye =  this.items.filter(donnee => !donnee.datePaiement).reduce((total, invoice) => total + invoice.TOTAL_DUE_DATE_FCFA, 0);
            console.log(this.montantTotalFactureImpaye);
            this.montantTotalFacture =  this.items.filter(donnee => !donnee.datePaiement).reduce((total, invoice) => total + invoice.TOTAL_DUE_DATE_FCFA, 0);
          }
      }
     
     // console.log(data);
      this.dataService.getItemFacture(data); 
      this.updatePagedData();
    });
  }

    

 


  getItems() {
    this.user = this.service.getUser();

    
    // Step 1: Get the user's historics
    this.service.getHistorics().subscribe((historicsData) => {
      console.log(historicsData);
      // Filter historics to get only those belonging to the current user
      const userHistorics = historicsData.filter((historic: any) => 
        historic.idUser === this.user.idUser && historic.action === 'Extraire'
      );
     
      console.log(userHistorics)
      if (userHistorics.length === 0) {
        this.items = [];
        this.updatePagedData();
        return;
      }

      // Extract unique idFacture values
      const uniqueFactureIds = Array.from(new Set(userHistorics.map((historic: any) => historic.fileName)));

     console.log(uniqueFactureIds)
      // Step 2: Get all invoices
      this.service.getItemsInvoice().subscribe((data) => {
        // Filter invoices to match the idFacture from the user's historics
       
        this.items = data.filter((item: any) => uniqueFactureIds.includes(item.Id));
       
        console.log(this.items);
        this.dataService.getItemFacture(this.items); 
        this.updatePagedData();
      });
    });
  }

    

  getDataFcture(){
    this.user = this.service.getUser();
   this.service.getItemsInvoice().subscribe(data => {
     this.items = data;
     this.totalFacture=data.length;
     // console.log(this.totalFacture);
      //console.log(data[0].datePaiement);
     
      for (let i = 0; i < data.length; i++) {
        const donnee = data[i];
        this.montantTotalFacture = donnee.TOTAL_DUE_DATE_FCFA + this.montantTotalFacture;
       // console.log(this.montantTotalFacture);
        console.log(this.montantTotalFacture);
        if(donnee.datePaiement)
          {
           
            this.nombreFacturePayee = this.items.filter(donnee => donnee.datePaiement).length;
            console.log(this.nombreFacturePayee);
            this.montantTotalFacturePayee = this.montantTotalFacturePayee + donnee.MontantPayer
            console.log(this.montantTotalFacturePayee)
            
          }else{
            this.nombreFactureImpaye = this.items.filter(donnee => !donnee.datePaiement).length;
            console.log(this.nombreFactureImpaye);
            this.montantTotalFactureImpaye = this.montantTotalFactureImpaye + donnee.TOTAL_DUE_DATE_FCFA;
            console.log(this.montantTotalFactureImpaye);
          }
      }
     this.dataService.getItemFacture(data); 
     this.updatePagedData();
    
});
}

getItemDocument(itemId:string){
  if (itemId) {
    this.service.getItemByDocuments(itemId).subscribe(data => {
      this.item = data;
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
    this.dataService.changeItem(data);
    this.viewDocument(itemId);
    this.router.navigate(['/item']);
  });
}
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

getUniqueSuppliers(suppliers: any[]): any[] {
  const uniqueVendors = new Set();
  return suppliers.filter(supplier => {
    if (!uniqueVendors.has(supplier.VENDOR_NAME)) {
      uniqueVendors.add(supplier.VENDOR_NAME);
      return true;
    }
    return false;
  });
}

loadSuppliers(): void {
  this.service.getItemsInvoice().subscribe(data => {
    this.suppliers = data;
    this.uniqueSuppliers = this.getUniqueSuppliers(this.suppliers);
});
}

onSubmit(): void {
  if (this.supplierForm.valid) {
    const formValues = this.supplierForm.value;
    console.log('Form Submitted', formValues);
    // Ajoutez votre logique de soumission ici
  }
}

}
