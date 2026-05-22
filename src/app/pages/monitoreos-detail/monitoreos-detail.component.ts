import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { NavController } from '@ionic/angular';
import { MonitoreosService } from '../../services/monitoreos.service';
import { addIcons } from 'ionicons';
import { documentTextOutline, attachOutline, arrowBackOutline, calendarOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-monitoreos-detail',
  templateUrl: './monitoreos-detail.component.html',
  styleUrls: ['./monitoreos-detail.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent]  
})
export class MonitoreosDetailComponent implements OnInit {
  monitoreo: any = {};
  urlBase = 'https://app.sgacedom.org/storage/';

  constructor(private route: ActivatedRoute, private monitoreosService: MonitoreosService, private modalCtrl: ModalController, private navCtrl: NavController) {
    addIcons({
      'document-text-outline': documentTextOutline,
      'attach-outline': attachOutline,    
      'arrow-back-outline': arrowBackOutline,
      'calendar-outline': calendarOutline
    });    
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.monitoreosService.getById(id).subscribe({
      next: (data) => {
        this.monitoreo = data;
      },
      error: () => {
        this.navCtrl.navigateBack('/monitoreos');
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

  mesMap: { [key: number]: string } = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',                            
  };       
}


