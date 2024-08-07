import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../service/DataService';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgIf,NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Chart, registerables } from 'chart.js'

@Component({
  selector: 'app-analyse-data',
  standalone: true,
  imports: [NgIf,NgFor,ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './analyse-data.component.html',
  styleUrl: './analyse-data.component.scss'
})
export class AnalyseDataComponent implements OnInit,AfterViewInit{
  items: any[] = [];
  supplierForm!: FormGroup;
  suppliers: any[] = [];
  totalFacture:any;
  nombreFacturePayee=0;
  nombreFactureImpaye=0;
  montantTotalFacture=0;
  montantTotalFacturePayee=0;
  montantTotalFactureImpaye=0;
  selectedSupplier!:string;
  dateDebut!:string;
  dateFin!:string;
  uniqueSuppliers: any[] = [];


  private chart: Chart<'pie', number[], string> | undefined;


  ngOnInit(): void {

    this.loadSuppliers();
    
    this.onChange();
  }
  constructor(private fb: FormBuilder,private dataService:DataService,private service:ExtractionServiceService,private router:Router){

    this.supplierForm = this.fb.group({
      supplier: [''],
      startDate: [''],
      endDate: ['']
    });

  }
  
  ngAfterViewInit(){
    this.service.getTotalReceiptFacture().subscribe((data) => {
      console.log(data);

      // Transform the data
      const labels = Object.keys(data);
      const values = Object.values(data);

      // Register chart.js components
      Chart.register(...registerables);

      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Due Date FCFA',
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Montant total des factures par fournisseur'
            }
          }
        }
      });
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
    this.montantTotalFacture = 0;
    this.montantTotalFacturePayee = 0;
    this.montantTotalFactureImpaye = 0;
    if (this.supplierForm.valid) {
      this.dateDebut = this.supplierForm.get('startDate')?.value;
      this.dateFin = this.supplierForm.get('endDate')?.value;
      this.service.getItemsInvoice().subscribe(data => {
        this.items = data;
        this.totalFacture=data.length;
        
        
         for (let i = 0; i < data.length; i++) {
           const donnee = data[i];
           this.montantTotalFacture = donnee.TOTAL_DUE_DATE_FCFA + this.montantTotalFacture;
          // console.log(this.montantTotalFacture);
           console.log(this.montantTotalFacture);
           if(donnee.datePaiement && this.dateDebut <= donnee.datePaiement && donnee.datePaiement <= this.dateFin)
             {
              
               this.nombreFacturePayee = this.items.filter(donnee => donnee.datePaiement).length;
               console.log(this.nombreFacturePayee);
               this.montantTotalFacturePayee = this.montantTotalFacturePayee + donnee.MontantPayer
               console.log(this.montantTotalFacturePayee);
               
               
             }
             
         }
         this.createOrUpdateChart();
         
       
     });
   

    }
  }

  goBack() {
    this.router.navigate(['/document'])
  }

  
  onSupplierChange(): void {
    this.montantTotalFacture = 0;
    this.montantTotalFacturePayee = 0;
    this.montantTotalFactureImpaye = 0;
    this.selectedSupplier = this.supplierForm.get('supplier')?.value;

    this.service.getVendorByName(this.selectedSupplier).subscribe(data => {
      this.items = data;
      this.totalFacture = data.length;

      this.nombreFacturePayee = this.items.filter(donnee => donnee.datePaiement).length;
      this.montantTotalFacturePayee = this.items.filter(donnee => donnee.datePaiement).reduce((total, invoice) => total + invoice.MontantPayer, 0);

      this.nombreFactureImpaye = this.items.filter(donnee => !donnee.datePaiement).length;
      this.montantTotalFactureImpaye = this.items.filter(donnee => !donnee.datePaiement).reduce((total, invoice) => total + invoice.TOTAL_DUE_DATE_FCFA, 0);

      this.montantTotalFacture = this.items.reduce((total, invoice) => total + invoice.TOTAL_DUE_DATE_FCFA, 0);

      this.createOrUpdateChart();
    });
  }

  private createOrUpdateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    Chart.register(...registerables);

    const ctx = document.getElementById('mon_chart') as HTMLCanvasElement;

    this.chart = new Chart<'pie', number[], string>(ctx, {
      type: 'pie',
      data: {
        labels: ['Impayées', 'Payées'],
        datasets: [{
          label: 'Montant',
          data: [this.montantTotalFactureImpaye, this.montantTotalFacturePayee],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Montant total payé et impayé par fournisseur'
          }
        }
      }
    });
  }

  onChange() {
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
      //this.updatePagedData();
     
     // Transform the data
     

     // Register chart.js components
     Chart.register(...registerables);

     const ctx = document.getElementById('monChart') as HTMLCanvasElement;
     const myChart = new Chart(ctx, {
       type: 'pie',
       data: {
         labels: ['Impayées','Payées'],
         datasets: [{
           label: 'Montant',
           data: [this.montantTotalFactureImpaye,this.montantTotalFacturePayee],
           backgroundColor: [
             'rgba(255, 99, 132, 0.2)',
             'rgba(54, 162, 235, 0.2)',
             'rgba(75, 192, 192, 0.2)',
             'rgba(153, 102, 255, 0.2)'
           ],
           borderColor: [
             'rgba(255, 99, 132, 1)',
             'rgba(54, 162, 235, 1)',
             'rgba(75, 192, 192, 1)',
             'rgba(153, 102, 255, 1)'
           ],
           borderWidth: 1,
         }]
       },
       options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
          title: {
            display: true,
            text: 'Total payés et impayés de toutes factures'
          }
        }
       }
     });
     
   });
 }




}
