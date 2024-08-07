import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportService } from '../service/ExcelExportService';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgIf,NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-upload-facture-client',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,ReactiveFormsModule],
  templateUrl: './upload-facture-client.component.html',
  styleUrl: './upload-facture-client.component.scss'
})
export class UploadFactureClientComponent {

  selectedFile: File | null = null;
  message: string | null = null;

  constructor(public activeModal: NgbModal, private excelExportService: ExcelExportService,private service:ExtractionServiceService) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadClients(): void {
    if (this.selectedFile) {
      this.service.uploadClients(this.selectedFile).subscribe(
        {
          next:(response) =>{
            this.message = 'Clients uploaded successfully!';
          setTimeout(() => {
            window.location.reload();
          }, 1000);

          },
          error:(error)=>{
            this.message = `Error uploading clients: ${error.message}`;
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      );
    } else {
      this.message = 'Please select a file before uploading.';
       setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  closeDialog(): void {
    this.activeModal.dismissAll();
  }


}
