import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IonicModule, Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import OneSignal from 'onesignal-cordova-plugin';
import { addIcons } from 'ionicons';
import {
  personOutline,
  newspaperOutline,
  radioOutline,
  musicalNotesOutline,
  cashOutline,
  documentTextOutline,
  businessOutline,
  heartOutline,
  locationOutline,
  helpCircleOutline,
  mailOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonicModule],
})
export class AppComponent implements OnInit {
  currentRoute = '';
  user: any = null;
  ready = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private platform: Platform
    ) {
    addIcons({
      'person-outline': personOutline,
      'newspaper-outline': newspaperOutline,
      'radio-outline': radioOutline,
      'musical-notes-outline': musicalNotesOutline,
      'cash-outline': cashOutline,
      'document-text-outline': documentTextOutline,
      'business-outline': businessOutline,
      'heart-outline': heartOutline,
      'location-outline': locationOutline,
      'help-circle-outline': helpCircleOutline,
      'mail-outline': mailOutline,
      'log-out-outline': logOutOutline,
    });    
    this.currentRoute = this.router.url;

    this.platform.ready().then(() => {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
        this.toggleMenu();
    });

      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        OneSignal.Debug.setLogLevel(6);

        OneSignal.initialize('a0d24635-6b37-4c1a-8614-16e21cbe86e2');

        OneSignal.Notifications.requestPermission(false)
          .then((accepted: boolean) => {
            console.log('User accepted notifications: ' + accepted);
          });

      }
    });
  }

  ngOnInit() {
    this.authService.loadUser();

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.ready = true;
    });
    console.log(this.user);
    this.toggleMenu();
  }

  get fotoUrl() {
    if (!this.user?.foto) {
      return 'assets/img/user.png';
    }
    return `https://app.sgacedom.org${this.user.foto}`;
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  showMenu(): boolean {
    const noMenuRoutes = ['/login'];
    return !noMenuRoutes.some(route =>
      this.currentRoute.startsWith(route)
      );
  }


  private toggleMenu() {
    const noMenuRoutes = ['/login'];

    if (noMenuRoutes.some(route => this.currentRoute.startsWith(route))) {
      this.menuCtrl.enable(false);
    } else {
      this.menuCtrl.enable(true);
    }
  }

}

