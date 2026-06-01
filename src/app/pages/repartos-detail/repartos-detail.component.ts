import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { NavController } from '@ionic/angular';
import { RepartosService } from '../../services/repartos.service';
import { addIcons } from 'ionicons';
import { documentTextOutline, attachOutline, arrowBackOutline, calendarOutline,  cashOutline, addCircleOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-repartos-detail',
  templateUrl: './repartos-detail.component.html',
  styleUrls: ['./repartos-detail.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent]  
})
export class RepartosDetailComponent implements OnInit {
  reparto: any = {};
  urlBase = 'https://app.sgacedom.org/public/reparto/';

  constructor(private route: ActivatedRoute, private repartosService: RepartosService, private modalCtrl: ModalController, private navCtrl: NavController) {
    addIcons({
      'document-text-outline': documentTextOutline,
      'attach-outline': attachOutline,    
      'arrow-back-outline': arrowBackOutline,
      'calendar-outline': calendarOutline,
      'cash-outline': cashOutline,
      'add-circle-outline': addCircleOutline      
    });    
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.repartosService.getById(id).subscribe({
      next: (data) => {
        this.reparto = data;
      },
      error: () => {
        this.navCtrl.navigateBack('/repartos');
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

  async verDocumento(tipo: string, filename: string) {
    const url = this.urlBase + filename;

    await Browser.open({
      url,
      presentationStyle: 'fullscreen'
    });
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
}


