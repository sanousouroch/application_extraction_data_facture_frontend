import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink,MatIconModule,MatButtonModule,BaseChartDirective],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})

export class AccueilComponent {
  

}
