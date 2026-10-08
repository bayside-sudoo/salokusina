import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonButton, 
  IonItem, 
  IonInput, 
  IonIcon 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

// Import ang Firebase Authentication tools nang maayos
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonButton, 
    IonItem, 
    IonInput, 
    IonIcon
  ]
})
export class RegisterPage {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }

  async onRegister() {
    // 1. Tiyakin na may laman ang lahat ng fields
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      alert('Paki-sagutan ang lahat ng kailangang detalye.');
      return;
    }

    // 2. CHECK SA@ AT FORMAT NG EMAIL (Ito yung hinahanap natin!)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      alert('Mali ang pormat ng iyong email. Siguraduhing may @ at .com (Halimbawa: pangalan@gmail.com)');
      return;
    }

    // 3. Check kung magkatugma ang password
    if (this.password !== this.confirmPassword) {
      alert('Hindi magkatugma ang iyong Password at Confirm Password.');
      return;
    }

    if (this.password.length < 6) {
      alert('Ang password ay dapat hindi bababa sa 6 na characters.');
      return;
    }

    // 4. Ipadala na sa Firebase Cloud
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      console.log('User registered successfully:', userCredential.user);
      
      // ISINAVE ANG FULLNAME PARA MABASA NG ACCOUNT SETUP PAGE
      localStorage.setItem('registeredFullName', this.fullName);
      
      alert('Matagumpay na nagawa ang iyong account!');
      
      // Diretso sa account setup sa halip na /home
      this.router.navigate(['/account-setup']);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Ang email address na ito ay ginagamit na ng ibang account.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Hindi tanggap ng Firebase ang pormat ng email mo.');
      } else {
        alert('May naganap na error: ' + error.message);
      }
    }
  }
}
