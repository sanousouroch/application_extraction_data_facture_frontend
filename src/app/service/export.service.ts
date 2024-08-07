import { Injectable, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';


const EXCEL_EXTENSION = '.xlsx';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor() { }

  /**
   * Creates excel from the table element reference.
   *
   * @param element DOM table element reference.
   * @param fileName filename to save as.
   */
  /*public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);

  }*/

    public exportTableElmToExcel(element: ElementRef, fileName: string): void {
      const table = element.nativeElement;
    
      // Extract headers
      const headers = Array.from(table.querySelectorAll('thead tr th')).map((th: any) => th.innerText);
    
      // Extract data rows
      const data = Array.from(table.querySelectorAll('tbody tr')).map((tr: any) =>
        Array.from(tr.querySelectorAll('td')).map((td: any) => td.innerText)
      );
    
      // Combine headers and data
      const wsData = [headers, ...data];
    
      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    
      // Generate workbook and add the worksheet
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    
      // Save to file
      XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
    }
  
}