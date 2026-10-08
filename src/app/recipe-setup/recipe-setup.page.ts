import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonItem, IonInput, 
  IonTextarea, IonButton, IonSelect, IonSelectOption 
} from '@ionic/angular';

@Component({
  selector: 'app-recipe-setup',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar class="setup-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/menu" color="dark"></ion-back-button>
        </ion-buttons>
        <ion-title class="setup-title">Recipe Setup</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding bg-light-orange">
      <div class="setup-container">
        
        <div class="welcome-text" style="margin-bottom: 20px;">
          <h2>Ihanda ang iyong Resipe</h2>
          <p>Ilagay muna ang mga pangunahing detalye bago simulan ang pagsusulat.</p>
        </div>

        <!-- Recipe Setup Form -->
        <div class="setup-form">
          
          <!-- Pangalan ng Ulam -->
          <ion-item lines="none" style="margin-bottom: 15px;">
            <ion-input type="text" placeholder="Pangalan ng Ulam (Title)" [(ngModel)]="title"></ion-input>
          </ion-item>

          <!-- Kategorya Selection -->
          <ion-item lines="none" style="margin-bottom: 15px;">
            <ion-select placeholder="Pumili ng Kategorya" [(ngModel)]="category" mode="ios">
              <ion-select-option value="Filipino">Filipino</ion-select-option>
              <ion-select-option value="Pang-Pulutan">Pang-Pulutan</ion-select-option>
              <ion-select-option value="Sweets and Desserts">Sweets and Desserts</ion-select-option>
              <ion-select-option value="Salad">Salad</ion-select-option>
              <ion-select-option value="Best Chef's Choice">Best Chef's Choice</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Maikling Deskripsyon -->
          <ion-item lines="none" style="margin-bottom: 20px;">
            <ion-textarea rows="4" placeholder="Maikling Deskripsyon (Description)" [(ngModel)]="description"></ion-textarea>
          </ion-item>

          <!-- Start Writing Button -->
          <div class="btn-group">
            <ion-button expand="block" (click)="startWriting()">
              START WRITING
            </ion-button>
          </div>

        </div>

      </div>
    </ion-content>
  `,
  styleUrls: ['./recipe-setup.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonItem, IonInput,
    IonTextarea, IonButton, IonSelect, IonSelectOption
  ]
})
export class RecipeSetupPage {
  title: string = '';
  category: string = '';
  description: string = '';

  constructor(private router: Router) {}

  startWriting() {
    if (!this.title.trim() || !this.category || !this.description.trim()) {
      alert('Paki-punan ang pamagat, kategorya, at deskripsyon.');
      return;
    }

    // Ipasa ang data patungo sa recipe-editor page
    this.router.navigate(['/recipe-editor'], {
      state: {
        title: this.title,
        category: this.category,
        description: this.description
      }
    });
  }
}