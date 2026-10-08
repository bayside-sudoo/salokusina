import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonAvatar, IonPopover, IonList, 
  IonItem, IonIcon, IonLabel, IonFooter, IonTabBar, 
  IonTabButton, IonBadge, IonSearchbar 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, restaurantOutline, home, 
  searchOutline, bookOutline, pencilOutline, 
  notificationsOutline, eyeOutline 
} from 'ionicons/icons';

// Firebase imports
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonAvatar, IonPopover, IonList,
    IonItem, IonIcon, IonLabel, IonFooter, IonTabBar,
    IonTabButton, IonBadge, IonSearchbar // <--- Idinagdag dito
  ]
})
export class MenuPage implements OnInit {
  allRecipes: any[] = [];         // Dito nakatabi ang lahat ng galing sa Firestore
  publishedRecipes: any[] = [];   // Dito nakasalalay ang ipapakita (na-filter na) listahan
  isLoading: boolean = true;

  constructor(private router: Router) {
    addIcons({
      logOutOutline, restaurantOutline, home,
      searchOutline, bookOutline, pencilOutline,
      notificationsOutline, eyeOutline
    });
  }

  async ngOnInit() {
    await this.loadPublishedRecipes();
  }

  async loadPublishedRecipes() {
    const db = getFirestore();
    try {
      const q = query(
        collection(db, 'recipes'), 
        where('status', '==', 'Published')
      );
      
      const querySnapshot = await getDocs(q);
      this.allRecipes = [];
      
      querySnapshot.forEach((doc) => {
        this.allRecipes.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Ipasa muna sa publishedRecipes ang kopya ng lahat ng ulam
      this.publishedRecipes = [...this.allRecipes];
      this.isLoading = false;
    } catch (error) {
      console.error('Error sa pag-load ng published recipes:', error);
      this.isLoading = false;
    }
  }

  // Function para salain ang mga ulam batay sa tina-type ng user
  handleSearch(event: any) {
    const searchTerm = event.target.value ? event.target.value.toLowerCase().trim() : '';

    if (!searchTerm) {
      // Kung walang laman ang searchbar, ipakita ulit lahat
      this.publishedRecipes = [...this.allRecipes];
    } else {
      // Salain base sa pamagat (title) o deskripsyon (description)
      this.publishedRecipes = this.allRecipes.filter(recipe => 
        (recipe.title && recipe.title.toLowerCase().includes(searchTerm)) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchTerm))
      );
    }
  }

  async onLogout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error sa pag-logout:', error);
    }
  }
}