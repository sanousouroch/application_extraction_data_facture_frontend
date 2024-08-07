import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  // Method to generate and download Excel file with only headers
  exportClientData(): void {
    // Define the headers for the Excel file
    const headers = [
      'Date d\'Échéance',
      'Numéro de Facture',
      'Nom du Client',
      'Montant HT',
      'Montant TTC',
      'Statut',
      'Solde',
      'Mode de Paiement'
    ];

    // Create an array of objects to represent the headers
    const data = [headers];

    // Create a new worksheet with only headers
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');

    // Generate buffer and download the file
    XLSX.writeFile(workbook, 'Clients.xlsx');
  }
}
