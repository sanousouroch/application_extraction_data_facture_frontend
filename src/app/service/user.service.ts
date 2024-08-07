import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSource = new BehaviorSubject<{ idUser: string, nom: string, prenom: string } | null>(null);
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(user: { idUser: string, nom: string, prenom: string }) {
    this.userSource.next(user);
  }
}