import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonItem, IonInput, IonIcon 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, callOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-account-setup',
  templateUrl: './account-setup.page.html',
  styleUrls: ['./account-setup.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButton, IonItem, IonInput, IonIcon
  ]
})
export class AccountSetupPage implements OnInit {
  displayName: string = 'User Profile'; // Default name placeholder
  username: string = '';
  phoneNumber: string = '';
  birthday: string = '';

  constructor(private router: Router) {
    addIcons({ cameraOutline, callOutline, calendarOutline });
  }

  ngOnInit() {
    // KINUKUHA ANG PANGALAN NA IPINASA MULA SA REGISTER SCREEN
    const savedName = localStorage.getItem('registeredFullName');
    if (savedName) {
      this.displayName = savedName;
    }
  }
onSaveSetup() {
  if (!this.username) {
    alert('Paki-pili ang iyong gustong @username.');
    return;
  }
  if (!this.phoneNumber) {
    alert('Paki-lagay ang iyong mobile number.');
    return;
  }
  alert(`Welcome sa Salo Kusina, @${this.username.toLowerCase()}!`);

  // PINALITAN ITO PARA DIRETSO SA KANILANG MAIN MENU DASHBOARD
  this.router.navigate(['/menu']);
}

}
