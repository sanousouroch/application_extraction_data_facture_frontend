import { Component, OnInit,Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DataService } from '../service/DataService';
import { UserService } from '../service/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desactivate-user',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './desactivate-user.component.html',
  styleUrl: './desactivate-user.component.scss'
})
export class DesactivateUserComponent implements OnInit{

  @Input() idUser: any;
  @Input() nom: any;
  @Input() prenom: any;

  roleForm!: FormGroup;
  response:any;
  reponse:any;
  role:string="Non defini";

  users: any[] = [];
  public page =1;
  public pageSize=15;
  pagedUsers: any[] = [];



  ngOnInit() {

    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.roleForm = this.fb.group({
          idUser: [user?.idUser, Validators.required],
          nom: [user?.nom, Validators.required],
          prenom: [user?.prenom, Validators.required]
        });
       
      }
    });
   
  }






constructor(private dialog:NgbModal,private service:ExtractionServiceService,private fb: FormBuilder,private dataservice:DataService,private userService: UserService,private router:Router){
  
}

closeDialog()
{
  this.onLoad();
  this.dialog.dismissAll();
 
}
onSubmit() {
 
  if (this.roleForm.valid) {
     const {idUser} = this.roleForm.value
     this.service.updateUser(idUser,this.role).subscribe(
      response => {
         this.response = 'Utilisateur désactivé avec succès';
         setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.reponse = 'Echec de la désactivation de l\'utilisateur';
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      }
    );
  }
   
  }


  updatePagedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  onLoad()
  {
    
    this.service.getUsers().subscribe((data) => {
      this.users = data;
      this.updatePagedData();
    });
    
  }

 
  




}
