import { Component, OnInit, ViewChild } from '@angular/core';

import { IonicModule, AlertController, NavController, ModalController, ToastController, LoadingController, IonModal } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { ObrasService } from '../../services/obras.service';
import { CatalogsService } from '../../services/catalogs.service';
import { CondicionesModalComponent } from '../../components/condiciones-modal/condiciones-modal.component';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline, calendarOutline } from 'ionicons/icons';
import { SearchableSelectComponent } from '../../components/searchable-select/searchable-select.component';


@Component({
  standalone: true,
  selector: 'app-obras-form',
  templateUrl: './obras-form.component.html',
  styleUrls: ['./obras-form.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, SgHeaderComponent, SearchableSelectComponent],
})
export class ObrasFormComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  obra: any = {};
  editoras:any = [];
  generos:any = [];
  isEdit = false;
  mostrarErrorCondiciones = false;
  lugaresPublicacion = [
    { value: 'Radio', label: 'Radio' },
    { value: 'TV', label: 'Televisión' },
    { value: 'Youtube', label: 'Youtube' },
    { value: 'Spotify', label: 'Spotify' },
    { value: 'Apple', label: 'Apple Music' },
    { value: 'Otro', label: 'Otro' }
  ];

  selectGeneroOptions = {
    searchPlaceholder: 'Buscar género...',
  };  

  constructor(
    private route: ActivatedRoute,
    private obrasService: ObrasService,
    private catalogsService: CatalogsService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline,
      'calendar-outline': calendarOutline
    });
  }

  async ngOnInit() {
    this.editoras = await this.catalogsService.getEditoras();
    this.generos = await this.catalogsService.getGeneros();
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      const data = await firstValueFrom(this.obrasService.getById(id));

      this.obra = {
        ...data,
        usa_ia: !!data.usa_ia,
        porcentaje_ia: data.porcentaje_ia ?? null,
        lpublico: data.lpublico ? data.lpublico.split(',').map((v: string) => v.trim()) : [],
        aceptaCondiciones: true,
      };
    } else {
      this.obra = {
        titulo: '',
        otrosTitulos: '',
        genero: '',
        duracion: '',
        fechaPublicacion: '',
        interpretes: '',
        catalogo: '',
        comentarios: '',

        usa_ia: false,
        uso_ia: '',
        porcentaje_ia: null,
        lugarPublicacion: [] as string[],
        colaboradores: [],
        aceptaCondiciones: false,
      };
    }
  }

  async onSubmit() {
    if (!this.isEdit && !this.obra.aceptaCondiciones) {
      this.mostrarErrorCondiciones = true;
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando obra...',
      backdropDismiss: false
    });

    await loading.present(); 

    const payload = {
      titulo: this.obra.titulo,
      titulos: this.obra.titulos,
      genero: this.obra.genero,
      genero_otro_descripcion: this.obra.genero == 'Otro' ? this.obra.genero_otro_descripcion : null,
      duracion: this.obra.duracion,
      fejecucion: this.obra.fejecucion,
      lpublico: Array.isArray(this.obra.lpublico) ? this.obra.lpublico.join(',') : null,
      editora_id: this.obra.editora_id,
      editora_otra_descripcion: this.obra.editora_id == 0 ? this.obra.editora_otra_descripcion : null,
      colaboradores: this.obra.colaboradores,
      usa_ia: this.obra.usa_ia ? 1 : 0,
      uso_ia: this.obra.usa_ia ? this.obra.uso_ia : null,
      porcentaje_ia: this.obra.usa_ia ? this.obra.porcentaje_ia : null,
      nocatalogo: this.obra.nocatalogo,
      interpretes: this.obra.interpretes,
      comentario: this.obra.comentarios
    };
    
    try {
      if (this.isEdit) {
        await firstValueFrom(this.obrasService.update(this.obra.id, payload));
      } else {
        await firstValueFrom(this.obrasService.create(payload));
      }
      const toast = await this.toastCtrl.create({
        message: this.isEdit ? 'Obra actualizada correctamente': 'Obra declarada correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.navCtrl.navigateBack('/obras');
    } catch (err) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo guardar la obra.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  agregarColaborador() {
    this.obra.colaboradores.push({
      numSocio: '',
      nombre: '',
      profesion: '',
      ejecucion: null,
      mecanico: null,
    });
  }

  eliminarColaborador(index: number) {
    this.obra.colaboradores.splice(index, 1);
  }

  async abrirCondiciones() {
    const modal = await this.modalCtrl.create({
      component: CondicionesModalComponent,
      backdropDismiss: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<boolean>();
    this.obra.aceptaCondiciones = data === true;
  }


}