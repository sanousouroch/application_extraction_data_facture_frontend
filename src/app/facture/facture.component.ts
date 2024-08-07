import { Component, OnInit } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [NgIf,RouterLink,NgClass,MatIconModule,MatButtonModule],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.scss'
})
export class FactureComponent implements OnInit {

  user:any;
  currentDate!: string;
  token_access!: any;

  constructor(private service:ExtractionServiceService,private router:Router){}
  ngOnInit(): void {
   
    this.user = this.service.getUser();
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
