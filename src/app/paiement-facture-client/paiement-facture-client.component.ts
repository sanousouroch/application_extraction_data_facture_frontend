import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { DataService } from '../service/DataService';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-paiement-facture-client',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './paiement-facture-client.component.html',
  styleUrl: './paiement-facture-client.component.scss'
})
export class PaiementFactureClientComponent implements OnInit{

  reponse:any;
  response:any;
  user:any;
  currentDate!: string;
  paiementClientForm!: FormGroup;
  @Input() numeroFacture: any;
  constructor(private fb: FormBuilder,private service:ExtractionServiceService,private dialogRef:NgbModal){
   
  }

  

  ngOnInit(): void {
    this.paiementClientForm = this.fb.group({
      numeroFacture: [this.numeroFacture, Validators.required],
      statut: ['', Validators.required],
      modePaiement: ['', Validators.required]

    });
    
  }

  closeDialog()
  {
    this.dialogRef.dismissAll();
  
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

  onSubmit()
  {
    if (this.paiementClientForm.valid) {

      const {numeroFacture, statut,modePaiement} = this.paiementClientForm.value;
      this.user = this.service.getUser();
      this.currentDate = this.getCurrentDate();
      
      this.service.UpdateClientStatut(numeroFacture,statut,modePaiement).subscribe({
        next:(response) =>{
          this.service.addHistoric(this.currentDate,this.user.idUser,numeroFacture,"Paiement réussie","OK").subscribe({
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
          this.service.addHistoric(this.currentDate,this.user.idUser,numeroFacture,"Paiement échoué","Pas OK").subscribe({
            next:(reponse) =>{
              
              setTimeout(() => {
                window.location.reload();
              },1000);

              
            }
          })
  
        }
       });
    }

  }



}
