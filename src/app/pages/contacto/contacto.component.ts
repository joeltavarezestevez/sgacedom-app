import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { businessOutline, callOutline, mailOutline, locationOutline, logoWhatsapp, helpCircleOutline, informationCircleOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true
})
export class ContactoComponent  implements OnInit {

  public ubicacionUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.ubicacionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1892.1399117402298!2d-69.89443276458535!3d18.470980014214476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf883ab26cc2f5%3A0x451ad351eec243c8!2sSGACEDOM!5e0!3m2!1ses!2ses!4v1493139737905'
    );  

    addIcons({
      'mail-outline': mailOutline,
      'location-outline': locationOutline,
      'information-circle-outline': informationCircleOutline,
      'help-circle-outline': helpCircleOutline,
      'business-outline': businessOutline,
      'call-outline': callOutline,
      'logo-whatsapp': logoWhatsapp
    });    
  }

  ngOnInit() {}

  async openWhatsapp() {
    await Browser.open({
      url: 'https://wa.me/18496546579',
      presentationStyle: 'fullscreen'
    });
  }  
}

