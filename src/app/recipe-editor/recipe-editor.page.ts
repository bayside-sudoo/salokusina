import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonButton, IonIcon 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline, videocamOutline } from 'ionicons/icons';

@Component({
  selector: 'app-recipe-editor',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/recipe-setup" color="dark"></ion-back-button>
        </ion-buttons>
        <ion-title>Isulat ang Resipe</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <div style="max-width: 650px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); position: relative;">
        
        <h2>{{ title }}</h2>
        <p style="color: gray; margin-bottom: 20px;">Kategorya: {{ category }}</p>

        <!-- Mga Sangkap -->
        <div style="margin-bottom: 20px;">
          <label style="font-weight: bold; display: block; margin-bottom: 5px;">Mga Sangkap:</label>
          <textarea [(ngModel)]="ingredients" rows="3" placeholder="Ilagay ang mga sangkap dito..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-family: inherit;"></textarea>
        </div>

        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />

        <!-- MISMONG EDITOR NA PARANG MS WORD -->
        <div style="position: relative; min-height: 250px;">
          <label style="font-weight: bold; display: block; margin-bottom: 5px;">Mga Hakbang / Kuwento:</label>
          
          <!-- Dito magsusulat ang user, parang MS word -->
          <div 
            #editorArea
            contenteditable="true"
            (keyup)="listenCursor()"
            (click)="listenCursor()"
            (focus)="listenCursor()"
            style="width: 100%; min-height: 200px; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 15px; line-height: 1.5; outline: none; background: #fff; overflow-y: auto;">
            Magsimulang magsulat dito...
          </div>

          <!-- ANG MGA FLOATING ICONS (Lilitaw kung nasaan ang cursor) -->
          <div 
            *ngIf="showToolbar"
            [ngStyle]="{ 'top.px': toolbarTop, 'left.px': toolbarLeft }"
            style="position: absolute; display: flex; gap: 10px; align-items: center; background: white; border: 1px solid #ddd; padding: 4px 8px; border-radius: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.15); z-index: 10;">
            
            <!-- Photo Icon Button -->
            <label style="cursor: pointer; display: flex; align-items: center; color: #555;">
              <ion-icon name="image-outline" style="font-size: 20px;"></ion-icon>
              <input type="file" accept="image/*" (change)="insertMedia($event, 'image')" style="display: none;" />
            </label>

            <!-- Video Icon Button -->
            <label style="cursor: pointer; display: flex; align-items: center; color: #555;">
              <ion-icon name="videocam-outline" style="font-size: 20px;"></ion-icon>
              <input type="file" accept="video/*" (change)="insertMedia($event, 'video')" style="display: none;" />
            </label>
          </div>
        </div>

        <div style="margin-top: 30px;">
          <ion-button expand="block" (click)="saveRecipe()">SAVE RECIPE</ion-button>
        </div>

      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonButton, IonIcon
  ]
})
export class RecipeEditorPage implements OnInit {
  @ViewChild('editorArea') editorArea!: ElementRef<HTMLDivElement>;

  title: string = '';
  category: string = '';
  ingredients: string = '';
  
  // Para sa pagkontrol ng icons kung saan lilitaw
  showToolbar: boolean = false;
  toolbarTop: number = 0;
  toolbarLeft: number = 0;
  savedSelection: Range | null = null;

  constructor(private router: Router) {
    addIcons({ imageOutline, videocamOutline });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const data = navigation.extras.state as any;
      this.title = data.title || '';
      this.category = data.category || '';
    }
  }

  // Taga-subaybay kung nasaan ang cursor ng user
  listenCursor() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    this.savedSelection = range.cloneRange(); // I-save natin ang pwesto ng cursor

    // Kukunin natin ang coordinates (X at Y) ng cursor sa screen
    const rects = range.getClientRects();
    const editorRect = this.editorArea.nativeElement.getBoundingClientRect();

    if (rects.length > 0) {
      // I-compute ang coordinates relative doon sa editor box natin
      this.toolbarTop = rects[0].bottom - editorRect.top + 5; 
      this.toolbarLeft = rects[0].left - editorRect.left;
      this.showToolbar = true;
    } else {
      // Kung bagong blankong linya, ibaba natin ng konti base sa text height
      this.toolbarTop = this.editorArea.nativeElement.offsetHeight - 40;
      this.toolbarLeft = 15;
      this.showToolbar = true;
    }
  }

  // Dito ipapasok ang mismong picture/video kung nasaan ang cursor
  insertMedia(event: any, type: 'image' | 'video') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const mediaUrl = reader.result as string;
      let mediaHtml = '';

      // Gumawa ng HTML base sa piniling file
      if (type === 'image') {
        mediaHtml = `<br><img src="${mediaUrl}" style="max-width:100%; border-radius:6px; margin: 8px 0;" /><br>`;
      } else {
        mediaHtml = `<br><video src="${mediaUrl}" controls style="max-width:100%; border-radius:6px; margin: 8px 0;"></video><br>`;
      }

      // Ibalik ang cursor doon sa huling tinaposang sulat ng user
      const selection = window.getSelection();
      if (this.savedSelection && selection) {
        selection.removeAllRanges();
        selection.addRange(this.savedSelection);
        
        // I-inject ang larawan o video sa mismong tinuturo ng cursor
        document.execCommand('insertHTML', false, mediaHtml);
      }

      this.showToolbar = false; // Itago muna ang toolbar pagkatapos mag-insert
    };
  }

  saveRecipe() {
    // Dahil contenteditable ang gamit, kukunin natin ang laman gamit ang innerHTML
    const finalInstructionsHtml = this.editorArea.nativeElement.innerHTML;

    if (!this.ingredients.trim() || !finalInstructionsHtml.trim()) {
      alert('Paki-punan ang mga sangkap at ang mga hakbang.');
      return;
    }

    const currentUser = localStorage.getItem('currentUser') || 'default_user';
    const recipeData = {
      user: currentUser,
      title: this.title,
      category: this.category,
      ingredients: this.ingredients,
      instructionsHtml: finalInstructionsHtml, // Naka-HTML na ito kasama ang mga pictures!
      createdAt: new Date().toISOString()
    };

    const storageKey = `recipes_${currentUser}`;
    const existingRecipes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingRecipes.push(recipeData);
    localStorage.setItem(storageKey, JSON.stringify(existingRecipes));

    alert('Tagumpay na nai-save ang iyong resipe!');
    this.router.navigate(['/menu']);
  }
}
