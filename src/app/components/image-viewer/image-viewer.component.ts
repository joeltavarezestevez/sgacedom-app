import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';


@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content class="image-viewer-content">
      <ion-fab vertical="top" horizontal="end" slot="fixed">
        <ion-fab-button class="close-btn" size="small" (click)="close()">
          <ion-icon name="close"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <div class="image-wrapper">
        <img [src]="imageUrl" class="zoom-image" />
      </div>
    </ion-content>
  `,
  styles: [`
    .image-viewer-content {
      --background: black;
    }

    .image-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      overflow: hidden;
    }

    .close-btn {
      --background: rgba(0, 0, 0, 0.7);
      --color: white;
      --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }
    .zoom-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      touch-action: manipulation;
      user-select: none;
    }
  `]
})
export class ImageViewerComponent {
  @Input() imageUrl!: string;

  constructor(private modalCtrl: ModalController) {
    addIcons({ close });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
