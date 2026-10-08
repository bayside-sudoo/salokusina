import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons'; // Idinagdag para sa pagrehistro ng icons
import { restaurant } from 'ionicons/icons'; // Kinuha ang mismong restaurant icon

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonButton, 
    IonIcon
  ],
})
export class HomePage {
  constructor() {
    // Dito natin inirerehistro ang icon para mabasa ng HTML
    addIcons({ restaurant });
  }
}
