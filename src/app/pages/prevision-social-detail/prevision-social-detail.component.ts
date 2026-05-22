import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { PrevisionSocialService } from '../../services/prevision-social.service';;
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentTextOutline, attachOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';    

@Component({
  selector: 'app-prevision-social-detail',
  templateUrl: './prevision-social-detail.component.html',
  styleUrls: ['./prevision-social-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent],
})
export class PrevisionSocialDetailComponent implements OnInit {

  prevision: any;
  urlBase = 'https://app.sgacedom.org';
  constructor(private route: ActivatedRoute, private previsionService: PrevisionSocialService, private modalCtrl: ModalController, private navCtrl: NavController,
    private alertCtrl: AlertController) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'document-text-outline': documentTextOutline,
      'attach-outline': attachOutline
    });     
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.previsionService.getById(id).subscribe({
      next: (data) => {
        this.prevision = data;
        console.log(this.prevision);
      },
      error: async (response) => {
        console.log(response);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: response.error.message,
          buttons: ['OK'],
        });
        await alert.present();        
        this.navCtrl.navigateBack('/ayudas');
      }      
    });
  }

  onArchivoClick(filename: string) {
    if (this.isImage(filename)) {
      this.verImagen(filename);
      return;
    }

    if (this.isPdf(filename)) {
      this.verDocumento('Documento', filename);
      return;
    }

    this.verDocumento('Documento', filename);
  }

  async verImagen(filename: string) {
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        imageUrl: this.getFileUrl(filename)
      },
      showBackdrop: true,
      backdropDismiss: true
    });

    await modal.present();
  }

  async verDocumento(tipo: string, filename: string) {
    const url = this.urlBase + filename;

    await Browser.open({
      url,
      presentationStyle: 'fullscreen'
    });
  }  

  getFileUrl(file: string): string {
    return file.startsWith('http') ? file : this.urlBase + file;
  }

  getFileExtension(file: string): string {
    return file.split('.').pop()?.toLowerCase() || '';
  }

  isImage(file: string): boolean {
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(this.getFileExtension(file));
  }

  isPdf(file: string): boolean {
    return this.getFileExtension(file) === 'pdf';
  }

  TipoAyudaTextoMap: { [key: number]: string } = {
    1: 'Médica',
    2: 'Fallecimiento',
    3: 'Préstamo',
    4: 'Otro'
  };

  estadoTextoMap: Record<number, string> = {
    1: 'Nueva',
    2: 'Revisada',
    3: 'Completada',
    4: 'Cancelada'
  };

  estadoColorMap: Record<number, string> = {
    1: 'secondary',
    2: 'primary',
    3: 'success',
    4: 'danger'
  };
}
