import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportService } from '../service/ExcelExportService';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf,NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-upload-file-client',
  standalone: true,
  imports: [NgFor,NgIf,NgClass,ReactiveFormsModule],
  templateUrl: './upload-file-client.component.html',
  styleUrl: './upload-file-client.component.scss'
})
export class UploadFileClientComponent {

  selectedFile: File | null = null;
  message: string | null = null;
  user:any;
  currentDate!: string;

  constructor(public activeModal: NgbModal, private excelExportService: ExcelExportService,private service:ExtractionServiceService) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

  uploadClients(): void {
    if (this.selectedFile) {
      this.user = this.service.getUser();
      this.currentDate = this.getCurrentDate();

      this.service.uploadClients(this.selectedFile).subscribe(
        {
          next:(response) =>{
            this.message = 'Clients téléversés avec succès !';
          setTimeout(() => {
            window.location.reload();
          }, 1000);

          },
          error:(error)=>{
            this.message = `Téléversement échoué: ${error.message}`;
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
        }
      );
    } else {
      this.message = 'Veuillez selectionner le fichier excel svp !';
       setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  closeDialog(): void {
    this.activeModal.dismissAll();
  }

}
