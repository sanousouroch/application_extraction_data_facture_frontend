import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
//import * as Chart from 'chart.js';
import { LineController } from 'chart.js';
import { Chart, registerables } from 'chart.js'


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass,NgIf,RouterLink,MatIconModule,MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit,AfterViewInit{
  statistiques:any=[]
  user:any;

  currentDate!: string;
  token_access!: any;
  


  ngOnInit(): void {
    this.service.getCounts().subscribe((data) => {
      this.statistiques = data;
    });
    this.user = this.service.getUser();
    
  }


  constructor(private service:ExtractionServiceService, private router:Router){}

  onLoad()
  {
    
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

  ngAfterViewInit() {

    this.service.getCounts().subscribe((data) => {

      Chart.register(...registerables);
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'pie', // Remplacez par le type de graphique souhaité (par exemple, 'bar', 'pie', etc.)
      data: {
        
        datasets: [{
          label: 'Nombre',
          data: [data.userItemCount,data.factureItemCount],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'], // Couleurs pour chaque segment
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'], // Couleurs des bordures
          borderWidth: 1,
        }],
        labels: ['Utilisateurs','Factures']
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
      
    });
   
    
  }
  


}
