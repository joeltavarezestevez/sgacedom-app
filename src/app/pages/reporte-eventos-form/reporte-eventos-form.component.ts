import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService, PerfilUsuario } from '../../services/configuracion.service';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from 'src/app/components/sg-header/sg-header.component';
import { v4 as uuidv4 } from 'uuid';
import { ReporteEventoService } from '../../services/reporte-evento.service';
import * as L from 'leaflet';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline, attachOutline, locateOutline, calendarOutline, timeOutline } from 'ionicons/icons';
import { DomSanitizer } from '@angular/platform-browser';
import { CatalogsService } from '../../services/catalogs.service';
import { firstValueFrom } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-reporte-eventos-form',
  templateUrl: './reporte-eventos-form.component.html',
  styleUrls: ['./reporte-eventos-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, SgHeaderComponent],
})
export class ReporteEventosFormComponent implements OnInit  {
  reporte = this.getReporteInicial();
  isEdit = false;
  loading = false;  
  mostrarOtroTipo = false;
  ubicacionAutomatica = false;
  ubicacionUrl: any = '';
  mostrarMapa = false;
  flyer_url!: File;
  municipiosSeleccionados:any = null;
  provincias:any = [];

  constructor(private reporteService: ReporteEventoService,
    private catalogsService: CatalogsService, private toastCtrl: ToastController,
    private navCtrl: NavController, private loadingCtrl: LoadingController, private sanitizer: DomSanitizer) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline,
      'attach-outline': attachOutline,
      'locate-outline': locateOutline,
      'calendar-outline': calendarOutline,
      'time-outline': timeOutline
    });        
  }
  
  async ngOnInit() {
    //this.obtenerUbicacion();
    this.provincias = await this.catalogsService.getProvincias();
    if (this.reporte.provincia) {
      this.loadMunicipios(this.reporte.provincia);
    }     
  }

  async onProvinciaChange() {
    this.reporte.municipio = null;
    if (this.reporte.provincia) {
      await this.loadMunicipios(Number(this.reporte.provincia));
    }
  }

  private async loadMunicipios(provinciaId: number) {
    this.municipiosSeleccionados = await this.catalogsService.getMunicipios(provinciaId);
  }


  async clearUrl() {
    if(this.ubicacionAutomatica) {
      await this.obtenerUbicacion();
    }
    else {
      this.ubicacionUrl = '';
      this.reporte.enlace_ubicacion = '';
      this.reporte.latitud = 0;
      this.reporte.longitud = 0;
    }
  }


  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando evento...',
      backdropDismiss: false
    });

    await loading.present();   
     
    try {
      if (!this.reporte.nombre_evento || !this.reporte.tipo_actividad || !this.reporte.lugar || !this.reporte.fecha || !this.reporte.hora) {
        const toast = await this.toastCtrl.create({
          message: 'Por favor completa los campos obligatorios.',
          duration: 2000,
          color: 'warning'
        });
        toast.present();
        return;
      }
      
      this.loading = true;
      
      const res = await firstValueFrom(this.reporteService.uploadFile(this.flyer_url));
      
      console.log(res);
      
      this.reporte.flyer_url = res.file;

      const payload = {
        nombre_evento: this.reporte.nombre_evento,
        tipo_actividad: this.reporte.tipo_actividad,
        otro_tipo_actividad: this.reporte.tipo_actividad == 'Otro' ? this.reporte.otro_tipo_actividad : null,
        interpretes: this.reporte.interpretes,
        fecha: this.reporte.fecha,
        hora: this.reporte.hora,
        lugar: this.reporte.lugar,
        provincia: this.reporte.provincia,
        municipio: this.reporte.municipio,
        latitud: this.reporte.latitud ? this.reporte.latitud : null,
        longitud: this.reporte.longitud ? this.reporte.longitud : null,
        enlace_ubicacion: this.reporte.enlace_ubicacion ? this.reporte.enlace_ubicacion : null,
        observaciones: this.reporte.observaciones ? this.reporte.observaciones: null,
        flyer_url: this.reporte.flyer_url
      };      
      
      /*if (this.isEdit) {
        await firstValueFrom(this.reporteService.update(this.reporte.id, payload));
      } else {
        await firstValueFrom(this.reporteService.create(payload));
      }
      */
      
      await firstValueFrom(this.reporteService.create(payload));
      
      const toast = await this.toastCtrl.create({
        message: this.isEdit ? 'Reporte de evento actualizado correctamente': 'Reporte de evento creado correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.loading = false;
      this.reporte = this.getReporteInicial();
      this.navCtrl.navigateBack('/reporte-eventos');

    } catch (err: any) {
      const message =
        err?.error?.message ||
        'Ocurrió un error al guardar el reporte';

      const toast = await this.toastCtrl.create({
        message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

async obtenerUbicacion() {
  try {
    // Solicita permisos explícitamente
    const permStatus = await Geolocation.requestPermissions();

    if (permStatus.location !== 'granted') {
      alert('Permiso de ubicación denegado');
      return;
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    });

    this.reporte.latitud = position.coords.latitude;
    this.reporte.longitud = position.coords.longitude;

    const mapUrl = `https://maps.google.com/maps?q=${this.reporte.latitud},${this.reporte.longitud}&z=16&output=embed`;

    this.ubicacionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);

    this.reporte.enlace_ubicacion =
      `https://maps.google.com/maps?q=${this.reporte.latitud},${this.reporte.longitud}`;

    this.mostrarMapa = true;

  } catch (error) {
    console.error(error);
    alert('No se pudo obtener la ubicación');
  }
}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files?.[0];
      this.flyer_url = input.files?.[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.reporte.flyer_url = reader.result as string; // base64
      };
      reader.readAsDataURL(file);      
    }
  }   

  private getReporteInicial() {
    return {
      id: null,
      nombre_evento: '',
      tipo_actividad: '',
      otro_tipo_actividad: '',
      interpretes: '',
      fecha: null,
      hora: null,
      lugar: '',
      provincia: null,
      municipio: null,
      latitud: 0,
      longitud: 0,
      enlace_ubicacion:'',
      observaciones: '',
      flyer_url: ''
    };
  }
}