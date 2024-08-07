import { Component, OnInit } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgFor,NgIf } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivateUserComponent } from '../activate-user/activate-user.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../service/DataService';
import { UserService } from '../service/user.service';
import { DesactivateUserComponent } from '../desactivate-user/desactivate-user.component';
@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [NgFor,NgbPaginationModule,NgIf,ActivateUserComponent,DesactivateUserComponent],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit{

  users: any[] = [];
  public page =1;
  public pageSize=15;
  data:any;
  userInfos : any[]=[];
 

  pagedUsers: any[] = [];
  ngOnInit(): void {
    this.onLoad();
  }


  constructor(private service:ExtractionServiceService,private router:Router,private dialogRef:NgbModal,private dataservice:DataService,private userService: UserService){}



  onLoad()
  {
    
    this.service.getUsers().subscribe((data) => {
      this.users = data;
      this.updatePagedData();
    });
    
  }

  openDialog(idUser: string, nom: string, prenom: string)
  {
    //this.dialogRef.open(ActivateUserComponent);
   
    const modalRef = this.dialogRef.open(ActivateUserComponent);
    modalRef.componentInstance.idUser = idUser;
    modalRef.componentInstance.nom = nom;
    modalRef.componentInstance.prenom = prenom;
    
    this.userService.changeUser({ idUser, nom, prenom });
  
  }

  openDialogue(idUser: string, nom: string, prenom: string)
  {
    //this.dialogRef.open(ActivateUserComponent);
   
    const modalRef = this.dialogRef.open(DesactivateUserComponent);
    modalRef.componentInstance.idUser = idUser;
    modalRef.componentInstance.nom = nom;
    modalRef.componentInstance.prenom = prenom;
    
    this.userService.changeUser({ idUser, nom, prenom });
  
  }

  

  

  updatePagedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  goBack() {
    this.router.navigate(['/document'])
  }

}
