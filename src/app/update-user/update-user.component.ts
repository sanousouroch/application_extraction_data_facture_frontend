import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit{

  user:any;
  response:any;

  userForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  constructor(private router:Router,private formBuilder: FormBuilder ,private service:ExtractionServiceService, private userService:UserService){}


  initForm(): void {
    this.user = this.service.getUser();
    this.userForm = this.formBuilder.group({
      idUser: [this.user.idUser, Validators.required],
      nom: [this.user.nom, Validators.required],
      prenom: [this.user.prenom, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, Validators.required],
      // Ajoutez d'autres champs selon votre besoin
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.user = this.service.getUser();
      const {idUser, nom,prenom,email,password} = this.userForm.value;
      // Appelez votre service pour mettre à jour l'utilisateur
      this.service.updateUserInfo(idUser, nom,prenom,email,password).subscribe(
        (data) => {
          this.response = 'Utilisateur mis à jour avec succès.';
          // Réinitialisez le formulaire après la soumission réussie si nécessaire
          this.userForm.reset();
          this.user.nom=nom;
          this.user.prenom=prenom
          this.service.setUser(this.user)
          if(this.user.role==='ADMIN')
            { 
             
              setTimeout(() => {
                this.router.navigate(['/stats'])

              }, 1000);
                
            }else{
              setTimeout(() => {
                this.router.navigate(['/facture'])
              }, 1000);
            }
          
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
          this.response = 'Erreur lors de la mise à jour de l\'utilisateur.';
        }
      );
    } else {
      // Marquez tous les champs comme touchés pour afficher les messages d'erreur
      this.userForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.user = this.service.getUser();
    this.userForm.reset();
    if(this.user.role==='ADMIN')
      { 
          this.router.navigate(['/stats'])
      }else{
          this.router.navigate(['/facture'])
      }
  }


  


}
