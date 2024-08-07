import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inscription-user',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './inscription-user.component.html',
  styleUrl: './inscription-user.component.scss'
})
export class InscriptionUserComponent implements OnInit{

  userForm!: FormGroup;
  response: any;
  role:string="Non defini";

  ngOnInit(): void {
    
  }

  constructor(private fb: FormBuilder, private userService: ExtractionServiceService, private router:Router) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required]
     
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const { nom,prenom,email,password,telephone} = this.userForm.value;
      
      this.userService.inscriptionUser(telephone,nom,prenom,email,password,telephone,this.role).subscribe(
        response => {
          console.log(response);
          this.response = 'Utilisateur ' + nom + " " + prenom + ' ajouté avec succès';
          setTimeout(() => {
            this.router.navigate(['/sign-in']);
          }, 1000);
        },
        error => {
          this.response=' Erreur d\'ajout de l\'utilisateur';
          setTimeout(() => {
            this.router.navigate(['/register']);
          }, 1000);
        }
      );
    }
  }


}
