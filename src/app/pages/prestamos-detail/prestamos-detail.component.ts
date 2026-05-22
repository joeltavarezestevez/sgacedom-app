import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { PrestamoService } from '../../services/prestamos.service';;
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentTextOutline, attachOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';    

@Component({
  selector: 'app-prestamos-detail',
  templateUrl: './prestamos-detail.component.html',
  styleUrls: ['./prestamos-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent],
})
export class PrestamosDetailComponent implements OnInit {

  prestamo: any;
  urlBase = 'https://app.sgacedom.org';
  constructor(private route: ActivatedRoute, private prestamoService: PrestamoService, private modalCtrl: ModalController, private navCtrl: NavController,
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

    this.prestamoService.getById(id).subscribe({
      next: (data) => {
        this.prestamo = data;
        console.log(this.prestamo);
      },
      error: async (response) => {
        console.log(response);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: response.error.message,
          buttons: ['OK'],
        });
        await alert.present();        
        this.navCtrl.navigateBack('/prestamos');
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
