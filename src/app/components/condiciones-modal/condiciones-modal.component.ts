import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-condiciones-modal',
  templateUrl: './condiciones-modal.component.html',
  styleUrls: ['./condiciones-modal.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class CondicionesModalComponent {
  constructor(private modalCtrl: ModalController) {}

  dismiss(acepta: boolean) {
    this.modalCtrl.dismiss(acepta);
  }
}
