import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { AlertController, NavController } from '@ionic/angular';
import { ObrasService } from '../../services/obras.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentTextOutline, attachOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';    
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-obras-detail',
  templateUrl: './obras-detail.component.html',
  styleUrls: ['./obras-detail.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class ObrasDetailComponent  implements OnInit {
  obra: any;
  urlBase = 'https://app.sgacedom.org';
  constructor(
    private obrasService: ObrasService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'document-text-outline': documentTextOutline,
      'attach-outline': attachOutline      
    });    
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.obrasService.getById(id).subscribe({
      next: (data) => {
        this.obra = data;
      },
      error: async (response) => {
        console.log(response);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: response.error.message,
          buttons: ['OK'],
        });
        await alert.present();        
        this.navCtrl.navigateBack('/obras');
      }
    });
  }

  getProfesionLabel(id: number): string {
    return this.profesionMap[id] || '—';
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
    2: 'Validada',
    3: 'Registrada',
    4: 'Rechazada'
  };

  estadoColorMap: Record<number, string> = {
    1: 'secondary',
    2: 'primary',
    3: 'success',
    4: 'danger'
  };

  profesionMap: Record<number, string> = {
    1: 'Autor',
    2: 'Administrador',
    3: 'Sub Editor',
    4: 'Compositor',
    5: 'Arreglista',
    6: 'Adaptador',
  };
}