import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonRouterLink } from '@ionic/angular'; // In-import ang IonRouterLink dito
import { addIcons } from 'ionicons';
import { restaurant } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonRouterLink, // Idinagdag ito rito sa imports framework
    IonContent, 
    IonButton, 
    IonIcon
  ],
})
export class HomePage {
  constructor() {
    addIcons({ restaurant });
  }
}
