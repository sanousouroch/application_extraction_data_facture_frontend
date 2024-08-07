import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {

  clientForm: FormGroup;
  response:any;
  reponse:any;
  selectedFile: File | null = null;
  message: string | null = null;
  user:any;
  currentDate!: string;

 

  constructor(private fb: FormBuilder, private servie: ExtractionServiceService,private dialog:NgbModal) {
    this.clientForm = this.fb.group({
      DateEcheance: ['', Validators.required],
      numeroFacture: ['', Validators.required],
      nomclient: ['', Validators.required],
      MontantHT: [0, [Validators.required, Validators.min(0)]],
      MontantTTC: [0, [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required],
      solde: [0, [Validators.required, Validators.min(0)]],
      modePaiement:['', Validators.required]
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.user = this.servie.getUser();
      this.currentDate = this.getCurrentDate();
      const {DateEcheance,numeroFacture,nomclient,MontantHT,MontantTTC,statut,solde,modePaiement} = this.clientForm.value;
      this.servie.saveClients(DateEcheance,numeroFacture,nomclient,MontantHT,MontantTTC,statut,solde,modePaiement).subscribe({
        next:(response) =>{
          this.servie.addHistoric(this.currentDate,this.user.idUser,numeroFacture,"Ajout du client ","OK").subscribe({
            next:(reponse) => {
              this.response= "Client ajouté avec succès"
          
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          })
        },
        error:(error)=>{
          this.reponse= "Echec de l'ajout du client. La facture existe déjà !"
          this.servie.addHistoric(this.currentDate,this.user.idUser,numeroFacture,"Ajout du client","Pas OK").subscribe({
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

  closeDialog()
  {
    this.dialog.dismissAll();
  }


  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Method to upload clients from the selected file
  uploadClients(): void {
    if (this.selectedFile) {
      this.servie.uploadClients(this.selectedFile).subscribe(
        (response) => {
          this.response = 'Clients ajoutés avec succès';
          setTimeout(() => {
          window.location.reload();
        }, 1000);
        },
        (error: HttpErrorResponse) => {
          this.reponse = 'Echec d\'ajout des clients';
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      );
    } else {
      this.message = 'Please select a file before uploading.';
    }
  }

}
