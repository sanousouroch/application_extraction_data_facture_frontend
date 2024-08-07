import { Component, OnInit,Input,OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DataService } from '../service/DataService';
import { UserService } from '../service/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Output } from '@angular/core';
import { error } from 'console';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.scss'
})
export class PaiementComponent implements OnInit{

  paiementForm!: FormGroup;
  @Input() idFacture: any;
  @Input() dateEcheance:any;
  response:any;
  reponse:any;
  formattedDate: string = '';
  user:any;
  currentDate!: string;
  constructor(private dialog:NgbModal,private service:ExtractionServiceService,private fb: FormBuilder,private dataservice:DataService,private userService: UserService,private router:Router){
  }
  ngOnInit(): void {
    const dateString = this.dateEcheance;
    const date = new Date(dateString);
    this.paiementForm = this.fb.group({
      idFacture: [this.idFacture, Validators.required],
      dateEcheance: [this.dateEcheance, Validators.required],
      datePaiement: ['', Validators.required],
      modePaiement: ['', Validators.required]
      
    });
    
  }

closeDialog()
{
  this.dialog.dismissAll();
 
}

getCurrentDate(): string {
  const currentDate = new Date();
  return currentDate.toISOString();
}

formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant le mois si nécessaire
  const day = ('0' + date.getDate()).slice(-2); // Ajoute un zéro devant le jour si nécessaire
  return `${year}-${month}-${day}`;
}

onSubmit() {
  if (this.paiementForm.valid) {
     const {idFacture,datePaiement,modePaiement} = this.paiementForm.value;
     this.user = this.service.getUser();
     this.currentDate = this.getCurrentDate();
     const dateString = datePaiement;
    const date = new Date(dateString);
     this.formattedDate = this.formatDateToYYYYMMDD(date);
     console.log(this.formattedDate);
     this.service.payerFacture(idFacture,this.formattedDate,modePaiement).subscribe({
      next:(response) =>{
        this.service.addHistoric(this.currentDate,this.user.idUser,idFacture,"Paiement réussie","OK").subscribe({
          next:(reponse) => {
            this.response= "Paiement réussie"
        
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        })
      },
      error:(error)=>{
        this.response= "Paiement échoué"
        this.service.addHistoric(this.currentDate,this.user.idUser,idFacture,"Paiement échoué","Pas OK").subscribe({
          next:(reponse) =>{

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        })

      }
     });
     
   
  }
   
  }


  

}



