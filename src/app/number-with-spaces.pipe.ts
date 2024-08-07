import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithSpaces'
})
export class NumberWithSpacesPipe implements PipeTransform {

  transform(value: number | string, ...args: any[]): string {
    if (value === null || value === undefined) {
      return '';
    }

    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) {
      return value.toString(); // Return the original value if it's not a number
    }

    // Convert the number to a string and format it with spaces
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}
