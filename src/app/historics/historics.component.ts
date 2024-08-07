import { Component, OnInit , } from '@angular/core';
import { ExtractionServiceService } from '../service/extraction-service.service';
import { NgIf, NgFor} from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-historics',
  standalone: true,
  imports: [NgbPaginationModule,NgIf,NgFor],
  templateUrl: './historics.component.html',
  styleUrl: './historics.component.scss'
})
export class HistoricsComponent implements OnInit{

  public page =1;
  public pageSize=15;
  historics: any[] = [];

  pagedHistorics: any[] = [];
  nom:any;
  prenom:any;

  user:any;
  users: any[] = [];

  ngOnInit(): void {
    this.onLoad();
  }

  constructor(private service:ExtractionServiceService,private router:Router){}


  updatePagedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedHistorics = this.historics.slice(startIndex, endIndex);
  }



  onLoad(): void {
    this.service.getHistorics().subscribe((historicsData) => {
      this.historics = historicsData;

      this.service.getUsers().subscribe((usersData) => {
        this.users = usersData;

        this.historics = this.historics.map(historic => {
          const user = this.users.find(u => u.idUser === historic.idUser);
          if (user) {
            return {
              ...historic,
              nom: user.nom,
              prenom: user.prenom
            };
          }
          return historic;
        });

        this.updatePagedData();
      });
    });
  }

  goBack() {
    this.router.navigate(['/document'])
  }

}

