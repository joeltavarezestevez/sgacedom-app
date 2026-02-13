import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sg-header',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ion-padding-top" style="padding-top: 1rem;">
        <ion-buttons slot="start">
          <ion-back-button *ngIf="showBack" defaultHref="/"></ion-back-button>
          <ion-menu-button *ngIf="!showBack" autoHide="false" menu="first"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
  `
})
export class SgHeaderComponent {
  @Input() title: string = 'SGACEDOM';
  @Input() showBack: boolean = false;
}
