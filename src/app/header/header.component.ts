import { Component, OnInit } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  currentDate!: string;
  token_access!: any;

  constructor(private service:ExtractionServiceService,private router:Router){}

  ngOnInit(): void {
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
}
