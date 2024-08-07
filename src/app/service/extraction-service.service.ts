import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpParams,HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExtractionServiceService{

  private apiUrl = 'http://localhost:3000/v1';
    constructor(private http: HttpClient) {}
   

    getDocument(key: String): Observable<Blob> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      });
      return this.http.get(`${this.apiUrl}/documents/${key}`, { headers,responseType: 'blob' });
    }
    
    getDocuments(): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      });
        return this.http.get(`${this.apiUrl}/documents`,{headers})
      }

      private handleError(error: HttpErrorResponse) {
        if (error.status === 403) {
          // Gérer les erreurs 403
          console.error('Error 403: Permission Denied', error.message);
        }
        return throwError(error);
      }

      getItemsInvoice(): Observable<any[]> {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        });
        return this.http.get<any[]>(`${this.apiUrl}/items`,{headers});
      }
    getItemByDocuments(Id:String):Observable<any>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      });
        return this.http.get(`${this.apiUrl}/items/${Id}`,{headers});
    }
    getItemFacturePDF(Id:String):Observable<any>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      });
      return this.http.get(`${this.apiUrl}/items/${Id}`,{headers});
  }
    getItemsFacture(Id:String):Observable<any>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      });
      return this.http.get(`${this.apiUrl}/items/${Id}`,{headers});
  }

  getItemDataFacture(Id: string, index: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get(`${this.apiUrl}/item/${Id}/${index}`,{headers});
  }

  uploadFacture(facture:FormData,idUser:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    const params = new HttpParams()
      .set('idUser', idUser);
      return this.http.post(`${this.apiUrl}/upload`,facture,{headers,params});
  }

  updateDataFacture(Id: string, facture: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    let params = new HttpParams();
    for (const key in facture) {
      if (facture.hasOwnProperty(key)) {
        params = params.append(key, facture[key]);
      }
    }

    return this.http.put(`${this.apiUrl}/items/${Id}`, null, { headers,params });
  }
 
  updateInvoiceItem(id: string, index: number, item: string, price: number, quantity: number, idUser:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    const params = new HttpParams()
      .set('ITEM', item)
      .set('PRICE', price.toString())
      .set('QUANTITY', quantity.toString())
      .set('idUser', idUser.toString());

    return this.http.put(`${this.apiUrl}/designation/${id}/${index}`, null, {headers, params });
  }


  inscriptionUser(idUser:string,nom:string,prenom:string,email:string,password:string,telephone:string,role:string): Observable<any>{
    const params = new HttpParams()
    .set('idUser', idUser)
    .set('nom', nom)
    .set('prenom', prenom)
    .set('email', email)
    .set('password', password)
    .set('telephone', telephone)
    .set('role', role);
    

    return this.http.post(`${this.apiUrl}/addUser`, null, { params });

  }

  seConnecter(identifier: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set(identifier.includes('@') ? 'email' : 'telephone', identifier)
      .set('password', password);

    return this.http.get(`${this.apiUrl}/getUser`, { params });
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  clearUser() {
    localStorage.removeItem('user');
  }

  getHistorics(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get(`${this.apiUrl}/events`,{headers});
  }

  getUsers(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get(`${this.apiUrl}/users`,{headers});
  }

  

  updateUser(idUser: string, role:String): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    const params = new HttpParams()
      .set('idUser', idUser)
      .set('role', role.toString());
      

    return this.http.put(`${this.apiUrl}/updateUserRole`, null,{headers, params });
  }

  

  getCounts(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get(`${this.apiUrl}/counts`,{headers});
  }
  getTotalReceiptFacture(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get(`${this.apiUrl}/total-due-by-supplier`,{headers});
  }
  getVendorByName(VENDOR_NAME:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    const params = new HttpParams()
    .set('supplier', VENDOR_NAME);

    return this.http.get(`${this.apiUrl}/invoices`,{headers,params});
  }

  updateUserInfo(idUser:string,nom:string,prenom:string,email:string,password:string): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });

    const params = new HttpParams()
    .set('idUser', idUser)
    .set('nom', nom)
    .set('prenom', prenom)
    .set('email', email)
    .set('password', password);
    

    return this.http.put(`${this.apiUrl}/updateUser`, null, { headers,params });

  }

  payerFacture(idFacture:string,datePaiement:string,modePaiement:string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    const params = new HttpParams()
    .set('invoiceId', idFacture)
    .set('datePaiement', datePaiement)
    .set('modePaiement',modePaiement)
    
    return this.http.put(`${this.apiUrl}/update-invoice`, null, { headers,params });
  }

  getUserById(idUser:String):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get(`${this.apiUrl}/updateUser/${idUser}`,{headers});
}


  


saveHistorics(idHistorics:string,idUser:string,fileName:string,action:string,status:string):Observable<any>{
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  const params = new HttpParams()
    .set('idHistorics', idHistorics)
    .set('idUser', idUser)
    .set('fileName',fileName)
    .set('action',action)
    .set('status',status);

    return this.http.post(`${this.apiUrl}/historics`,null,{headers,params});
}

addHistoric(idHistorics: string, idUser: string, fileName: string, action: string, statut: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  const url = `${this.apiUrl}/historics?idHistorics=${idHistorics}&idUser=${idUser}&fileName=${fileName}&action=${action}&statut=${statut}`;
  return this.http.post<any>(url, null,{headers});
}



saveClients(DateEcheance:string,numeroFacture:string,nomclient:string,MontantHT:string,MontantTTC:string,statut:string,solde:string,modePaiement:string):Observable<any>{
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  const params = new HttpParams()
    .set('DateEcheance', DateEcheance)
    .set('numeroFacture',numeroFacture)
    .set('nomclient',nomclient)
    .set('MontantHT',MontantHT)
    .set('MontantTTC',MontantTTC)
    .set('statut',statut)
    .set('solde',solde)
    .set('modePaiement',modePaiement)

    return this.http.post(`${this.apiUrl}/addClient`,null,{headers,params});
}

getClients(): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  return this.http.get(`${this.apiUrl}/clients`,{headers});
}

getClientByName(nomclient:string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  const params = new HttpParams()
  .set('nomclient', nomclient);

  return this.http.get(`${this.apiUrl}/clients/search`,{headers,params});
}

getClientByStatut(statut:string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  const params = new HttpParams()
  .set('statut', statut);

  return this.http.get(`${this.apiUrl}/client/search`,{headers,params});
}

UpdateClientStatut(numeroFacture:string,statut:string,modePaiement:string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });
  const params = new HttpParams()
  .set('numeroFacture',numeroFacture)
  .set('statut', statut)
  .set('modePaiement',modePaiement)

  return this.http.put(`${this.apiUrl}/updateClientStatus`,null,{headers,params});
}


uploadClients(file: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });

  return this.http.post(`${this.apiUrl}/addClientsFromExcel`, formData, { headers });
}


savetoken(id:string,jwt:string): Observable<any> {
  const params = new HttpParams()
  .set('id',id)
  .set('jwt', jwt)

  return this.http.post(`${this.apiUrl}/savejwt`,null,{params});
}


verifierToken(jwt:string): Observable<any> {
  const params = new HttpParams()
  .set('jwt', jwt)

  return this.http.get(`${this.apiUrl}/checkjwt`,{params});
}






}


