import { Component, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { DataService } from '../service/DataService';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { AddClientComponent } from '../add-client/add-client.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelExportService } from '../service/ExcelExportService';
import { UploadFileClientComponent } from '../upload-file-client/upload-file-client.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UploadFactureClientComponent } from '../upload-facture-client/upload-facture-client.component';
import { PaiementFactureClientComponent } from '../paiement-facture-client/paiement-facture-client.component';
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor,NgbPaginationModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit{

  public page =1;
  public pageSize=15;
  data:any;
  clients: any[] = [];
  donnees: any[] = [];
  user:any;
  uniqueClients:any[] = [];
  selectedClient!:string;

  @Output() numeroFacture: any;

  ClientForm!: FormGroup;
  clientForm!: FormGroup;
  clientForme!: FormGroup;

  montantTotalHT =0;
  montantTotalTTC=0;
  montantTotalTTCPayer = 0;
  montantTotalTTCImpayer =0;
  montantTotalHTPayer =0;
  montantTotalHTImpayer =0;

  
  
 
  pagedClients: any[] = [];
  ngOnInit(): void {
    this.user = this.service.getUser();
    this.onLoad();
    this.loadClients();
  }

  updatePagedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedClients = this.clients.slice(startIndex, endIndex);
  }

  onLoad()
  {
    
    this.service.getClients().subscribe((data) => {
      if(data)
      {
        this.clients = data;
      }
      this.updatePagedData();
    });
    
  }

  getUniqueClients(clients: any[]): any[] {
    const uniqueVendors = new Set();
    return clients.filter(client => {
      if (!uniqueVendors.has(client.nomclient)) {
        uniqueVendors.add(client.nomclient);
        return true;
      }
      return false;
    });
  }
  
  loadClients(): void {
    this.service.getClients().subscribe(data => {
      this.clients = data;
      //console.log(data)
      this.uniqueClients = this.getUniqueClients(this.clients);
      for (let i = 0; i < data.length; i++) {
        const donnee = data[i];

        this.montantTotalHT=this.montantTotalHT+donnee.MontantHT;
        this.montantTotalTTC = this.montantTotalTTC+donnee.MontantTTC;

        if(donnee.statut=='NON PAYE')
        {
          this.montantTotalHTImpayer= this.montantTotalHTImpayer + donnee.solde;
          this.montantTotalTTCImpayer = this.montantTotalTTCImpayer + donnee.solde;
        }else{

          this.montantTotalHTPayer= this.montantTotalHTPayer + donnee.MontantHT;
          this.montantTotalTTCPayer = this.montantTotalTTCPayer + donnee.MontantTTC;
        }

        
      }

  });
  }
  


  constructor(private fb: FormBuilder,private excelExportService: ExcelExportService,private service:ExtractionServiceService,private dialogRef:NgbModal,private router:Router){
    this.ClientForm = this.fb.group({
      nomclient: ['', Validators.required]
     
    });
    this.clientForm = this.fb.group({
      statut: ['', Validators.required]
    });

    this.clientForme = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });

  }

  openAddClientDialog() {
    this.dialogRef.open(AddClientComponent);
  }
  
  openUploadClientsDialog() {
    this.dialogRef.open(UploadFileClientComponent);
  }

  openUploadFactureDialog() {
    this.dialogRef.open(UploadFactureClientComponent);
  }

  openPaiementFactureClient(numeroFacture:string)
  {
    const modalRef = this.dialogRef.open(PaiementFactureClientComponent);
    modalRef.componentInstance.numeroFacture = numeroFacture;
  }
  
  onClientSelectByStatut() {
    this.montantTotalHT =0;
    this.montantTotalTTC=0;
    this.montantTotalTTCPayer = 0;
    this.montantTotalTTCImpayer =0;
    this.montantTotalHTPayer =0;
    this.montantTotalHTImpayer =0;
    this.selectedClient = this.clientForm.get('statut')?.value;
    //console.log(this.selectedClient);
    this.service.getClientByStatut(this.selectedClient).subscribe(data => {
      this.clients = data;
     // console.log(data);
      this.updatePagedData();

      for (let i = 0; i < data.length; i++) {
        const donnee = data[i];

        this.montantTotalHT=this.montantTotalHT+donnee.MontantHT;
        this.montantTotalTTC = this.montantTotalTTC+donnee.MontantTTC;

        if(donnee.statut=='NON PAYE')
        {
          this.montantTotalHTImpayer= this.montantTotalHTImpayer + donnee.solde;
          this.montantTotalTTCImpayer = this.montantTotalTTCImpayer + donnee.solde;
        }else{

          this.montantTotalHTPayer= this.montantTotalHTPayer + donnee.MontantHT;
          this.montantTotalTTCPayer = this.montantTotalTTCPayer + donnee.MontantTTC;
        }

        
      } 

  });
  }

  onClientSelect() {
    this.montantTotalHT =0;
    this.montantTotalTTC=0;
    this.montantTotalTTCPayer = 0;
    this.montantTotalTTCImpayer =0;
    this.montantTotalHTPayer =0;
    this.montantTotalHTImpayer =0;
    this.selectedClient = this.ClientForm.get('nomclient')?.value;
    this.service.getClientByName(this.selectedClient).subscribe(data => {
      this.clients = data;
      this.updatePagedData();
      for (let i = 0; i < data.length; i++) {
        const donnee = data[i];

        this.montantTotalHT=this.montantTotalHT+donnee.MontantHT;
        this.montantTotalTTC = this.montantTotalTTC+donnee.MontantTTC;

        if(donnee.statut=='NON PAYE')
        {
          this.montantTotalHTImpayer= this.montantTotalHTImpayer + donnee.solde;
          this.montantTotalTTCImpayer = this.montantTotalTTCImpayer + donnee.solde;
        }else{

          this.montantTotalHTPayer= this.montantTotalHTPayer + donnee.MontantHT;
          this.montantTotalTTCPayer = this.montantTotalTTCPayer + donnee.MontantTTC;
        }

        
      }



  });
  }

  

  // Method to handle the button click
  onExportClick(): void {
    this.excelExportService.exportClientData();
  }

  formatDateToYYYYMMDD(date: any): string {
    if (Object.prototype.toString.call(date) === '[object Date]') {
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant le mois si nécessaire
        const day = ('0' + date.getDate()).slice(-2); // Ajoute un zéro devant le jour si nécessaire
        return `${year}-${month}-${day}`;
      } else {
        throw new Error('Format de date invalide.');
      }
    } else {
      throw new Error('Format de date invalide.');
    }
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  
  onSubmit() {
    if (this.clientForme.valid) {
      this.montantTotalHT =0;
      this.montantTotalTTC=0;
      this.montantTotalTTCPayer = 0;
      this.montantTotalTTCImpayer =0;
      this.montantTotalHTPayer =0;
      this.montantTotalHTImpayer =0;

      const { dateDebut, dateFin } = this.clientForme.value;
  
      try {
        const dateDebutFormatted = this.formatDateToYYYYMMDD(new Date(dateDebut));
        const dateFinFormatted = this.formatDateToYYYYMMDD(new Date(dateFin));
       // console.log(dateDebutFormatted);
       // console.log(dateFinFormatted);
  
        this.service.getClients().subscribe((data: any[]) => {
          const filteredData = data.filter((donnee: any) => {
            if (donnee.DateEcheance) {
              try {
                const dateEcheance = this.parseDate(donnee.DateEcheance);
                const dateEcheanceFormatted = this.formatDateToYYYYMMDD(dateEcheance);
                return dateDebutFormatted <= dateEcheanceFormatted && dateEcheanceFormatted <= dateFinFormatted;
              } catch (e) {
                console.error(`Erreur de formatage de la date d'échéance: ${donnee.DateEcheance}`, e);
                return false;
              }
            }
            return false;
          });
  
          this.donnees = filteredData;
          this.clients = this.donnees;
          this.updatePagedData();

          for (let i = 0; i < this.donnees.length; i++) {
            const donnee = this.donnees[i];
    
            this.montantTotalHT=this.montantTotalHT+donnee.MontantHT;
            this.montantTotalTTC = this.montantTotalTTC+donnee.MontantTTC;
    
            if(donnee.statut=='NON PAYE')
            {
              this.montantTotalHTImpayer= this.montantTotalHTImpayer + donnee.solde;
              this.montantTotalTTCImpayer = this.montantTotalTTCImpayer + donnee.solde;
            }else{
    
              this.montantTotalHTPayer= this.montantTotalHTPayer + donnee.MontantHT;
              this.montantTotalTTCPayer = this.montantTotalTTCPayer + donnee.MontantTTC;
            }
    
            
          } 
         
  
          if (this.donnees.length === 0) {
            console.log("Aucun client trouvé dans cet intervalle de dates.");
          }
        });
      } catch (e) {
        console.error('Erreur de formatage des dates de début ou de fin.', e);
      }
    }
  }
  
  goBack() {
    this.router.navigate(['/document'])
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
  

}
