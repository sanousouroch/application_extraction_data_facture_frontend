import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private itemSource = new BehaviorSubject<any>(null);
  currentItem = this.itemSource.asObservable();
  currentItems = this.itemSource.asObservable();

  private documentSource = new BehaviorSubject<any>(null);
  currentDocument = this.documentSource.asObservable();

  constructor() { }

  changeItem(item: any) {
    this.itemSource.next(item);
  }


  
  changeItemFacture(item: any) {
    this.itemSource.next(item);
  }

  getItemFacture(item: any) {
    this.itemSource.next(item);
  }


  changeDocument(document: any) {
    this.documentSource.next(document);
  }

  changeUserInfo(item: any) {
    this.itemSource.next(item);
  }

}
