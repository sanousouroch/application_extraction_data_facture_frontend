import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../service/DataService';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-connexion-user',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './connexion-user.component.html',
  styleUrl: './connexion-user.component.scss'
})
export class ConnexionUserComponent {

  loginForm: FormGroup;
  response:any;
  reponse:any

  constructor(private fb: FormBuilder, private authService: ExtractionServiceService,private router:Router,private dataService:DataService) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  identifierValidator() {
    return (control: { value: string }) => {
      const value = control.value;
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      const phonePattern = /^\d{12}$/; // Example pattern for 10-digit phone numbers
      if (!value) {
        return null;
      }
      if (emailPattern.test(value) || phonePattern.test(value)) {
        return null;
      }
      return { pattern: true };
    };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const identifier = this.loginForm.get('identifier')?.value;
      const password = this.loginForm.get('password')?.value;
      
      this.authService.seConnecter(identifier,password).subscribe(
        
        response => {

        
          console.log(response);
          localStorage.setItem('accessToken', response.accessToken);
          this.dataService.changeUserInfo(response);
          this.authService.setUser(response.user);
           this.response = 'Connexion réussie';
            if(response.user.role=="ADMIN")
              {
                setTimeout(() => {
                  this.router.navigate(['/stats']);;
                }, 1000);
              
              }
            else{
              setTimeout(() => {
                this.router.navigate(['/facture']);
              }, 1000);
            }
        },
        error => {
          this.reponse = 'Echec de connexion, verifiez vos identifiants de connexion';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
          
        }
      );
    }
  }

  onResetPassword() {
    // Rediriger vers la page de réinitialisation du mot de passe
    this.router.navigate(['/']);
  }

  onClickRegister()
  {
    this.router.navigate(['/register'])
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartConfiguration['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

 



}
