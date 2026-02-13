import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ReporteEventoService } from '../../services/reporte-evento.service';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentTextOutline, attachOutline, locationOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-reporte-eventos-detail',
  templateUrl: './reporte-eventos-detail.component.html',
  styleUrls: ['./reporte-eventos-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent],
})
export class ReporteEventosDetailComponent implements OnInit {

  reporte: any;
  urlBase = 'https://app.sgacedom.org';
  constructor(private route: ActivatedRoute, private reporteEventoService: ReporteEventoService, private modalCtrl: ModalController, private navCtrl: NavController,
    private alertCtrl: AlertController) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'document-text-outline': documentTextOutline,
      'attach-outline': attachOutline,
      'location-outline': locationOutline
    });     
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.reporteEventoService.getById(id).subscribe({
      next: (data) => {
        this.reporte = data;
        console.log(this.reporte);
      },
      error: async (response) => {
        console.log(response);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: response.error.message,
          buttons: ['OK'],
        });
        await alert.present();        
        this.navCtrl.navigateBack('/reporte-eventos');
      }      
    });
  }

  async abrirUbicacion() {
    if (!this.reporte.enlace_ubicacion) return;

    await Browser.open({
      url: this.reporte.enlace_ubicacion,
      presentationStyle: 'fullscreen'
    });
  }

  getFechaHoraEvento(evento: any): Date | null {
    if (!evento?.fecha || !evento?.hora) {
      return null;
    }

    // Tomamos solo la fecha YYYY-MM-DD
    const fecha = evento.fecha.split('T')[0];

    // Combinamos fecha + hora
    return new Date(`${fecha}T${evento.hora}`);
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

  estadoTextoMap: Record<number, string> = {
    1: 'Nuevo',
    2: 'Validado',
    3: 'Recaudado',
    4: 'Rechazado'
  };

  estadoColorMap: Record<number, string> = {
    1: 'secondary',
    2: 'primary',
    3: 'success',
    4: 'danger'
  };

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
