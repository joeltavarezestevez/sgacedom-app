import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import { ReclamacionService } from '../../services/reclamacion.service';
import { CatalogsService } from '../../services/catalogs.service';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reclamaciones-form',
  templateUrl: './reclamaciones-form.component.html',
  styleUrls: ['./reclamaciones-form.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, SgHeaderComponent]
})
export class ReclamacionesFormComponent  implements OnInit {
  reclamacion: any = this.getReclamacionInicial();
  isEdit = false;
  motivos:any = [];
  paises:any = [];

  constructor(private route: ActivatedRoute,
    private reclamacionService: ReclamacionService,
    private catalogsService: CatalogsService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline
    });    
  }

  async ngOnInit() {
    this.motivos = await this.catalogsService.getMotivos();
    this.paises = await this.catalogsService.getPaises();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.reclamacion = { ...this.reclamacionService.getById(id) };
    }
    console.log(this.reclamacion);
  }

  async enviarReclamacion() {

    if (!this.reclamacion.titulos || !this.reclamacion.motivos_id || !this.reclamacion.mensaje) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor completa los campos obligatorios.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando reclamación...',
      backdropDismiss: false
    });

    await loading.present();       

    const payload = {
      titulos: this.reclamacion.titulos,
      motivos_id: this.reclamacion.motivos_id,
      mensaje: this.reclamacion.mensaje,

      concierto: this.reclamacion.concierto.activo ? 1 : 0,
      concierto_sala: this.reclamacion.concierto.activo ? this.reclamacion.concierto.sala : null,
      concierto_lugar: this.reclamacion.concierto.activo ? this.reclamacion.concierto.lugar : null,
      concierto_pais: this.reclamacion.concierto.activo ? this.reclamacion.concierto.pais : null,
      concierto_telefono: this.reclamacion.concierto.activo ? this.reclamacion.concierto.telefono : null,

      radio: this.reclamacion.radio.activo ? 1 : 0,
      radio_emisora: this.reclamacion.radio.activo ? this.reclamacion.radio.emisora : null,
      radio_programa: this.reclamacion.radio.activo ? this.reclamacion.radio.programa : null,
      radio_pais: this.reclamacion.radio.activo ? this.reclamacion.radio.pais : null,
      radio_telefono: this.reclamacion.radio.activo ? this.reclamacion.radio.telefono : null,

      tv: this.reclamacion.tv.activo ? 1 : 0,
      tv_compania: this.reclamacion.tv.activo ? this.reclamacion.tv.compania : null,
      tv_programa: this.reclamacion.tv.activo ? this.reclamacion.tv.programa : null,
      tv_pais: this.reclamacion.tv.activo ? this.reclamacion.tv.pais : null,
      tv_spot: this.reclamacion.tv.activo ? this.reclamacion.tv.spot : null,

      youtube: this.reclamacion.youtube ? 1 : 0,
      spotify: this.reclamacion.spotify ? 1 : 0,
      apple: this.reclamacion.apple ? 1 : 0,
      amazon: this.reclamacion.amazon ? 1 : 0,
      cd: this.reclamacion.cd ? 1 : 0,
      cassette: this.reclamacion.cassette ? 1 : 0,
      video: this.reclamacion.video ? 1 : 0,
      otros: this.reclamacion.otros ? 1 : 0,
    };

    try {
      if (this.isEdit) {
        await firstValueFrom(this.reclamacionService.update(this.reclamacion.id, payload));
      } else {
        await firstValueFrom(this.reclamacionService.create(payload));
      }
      const toast = await this.toastCtrl.create({
        message: this.isEdit ? 'Reclamación actualizada correctamente': 'Reclamación creada correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.navCtrl.navigateBack('/reclamaciones');
    } catch (err) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo guardar la reclamación.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }

    this.reclamacion = this.getReclamacionInicial();
  }

  private getReclamacionInicial() {
    return {
      titulos: '',
      motivos_id: null,
      mensaje: '',
      concierto: {
        activo: false,
        sala: null,
        lugar: null,
        pais: null,
        telefono: null,
      },
      radio: {
        activo: false,
        emisora: null,
        programa: null,
        pais: null,
        telefono: null,
      },
      tv: {
        activo: false,
        compania: null,
        programa: null,
        pais: null,
        spot: null,
      },
      youtube: false,
      spotify: false,
      apple: false,
      amazon: false,
      cd: false,
      cassette: false,
      video: false,
      otros: false
    };
  }  
}

