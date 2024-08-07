import { DetailDocumentComponent } from './detail-document/detail-document.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { DataComponent } from './data/data.component';
import { AccueilComponent } from './accueil/accueil.component';
import { UploadComponent } from './upload/upload.component';
import { ItemFactureComponent } from './item-facture/item-facture.component';
import { EditDetailFactureComponent } from './edit-detail-facture/edit-detail-facture.component';
import { EditionItemFactureComponent } from './edition-item-facture/edition-item-facture.component';
import { InscriptionUserComponent } from './inscription-user/inscription-user.component';
import { ConnexionUserComponent } from './connexion-user/connexion-user.component';
import { HistoricsComponent } from './historics/historics.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { FactureComponent } from './facture/facture.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { OneFactureComponent } from './one-facture/one-facture.component';
import { AnalyseDataComponent } from './analyse-data/analyse-data.component';
import { ClientComponent } from './client/client.component';


export const routes: Routes = [

    { path: '', component: AccueilComponent },
    { path: 'document', component: DocumentComponent },
    { path: 'data', component: DataComponent },
    { path: 'detail', component: DetailDocumentComponent },
    { path: 'extract', component: UploadComponent },
    { path: 'item', component: ItemFactureComponent},
    { path:'edit', component:EditDetailFactureComponent},
    { path: 'edition/:Id/:itemId', component: EditionItemFactureComponent },
    { path:'register', component:InscriptionUserComponent},
    { path:'sign-in', component:ConnexionUserComponent},
    { path:'event', component:HistoricsComponent},
    {path:'users',component:ListUsersComponent},
    {path:'facture', component:FactureComponent},
    {path:'stats',component:DashboardComponent},
    {path:'edit/user',component:UpdateUserComponent},
    {path:'new-extraction', component:OneFactureComponent},
    {path:'analyse',component:AnalyseDataComponent},
    {path:'client', component:ClientComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule] 
  })

  export class AppRoutingModule { }
