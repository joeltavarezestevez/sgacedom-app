import { Component, OnInit, ViewChild } from '@angular/core';

import { IonicModule, AlertController, NavController, ModalController, ToastController, LoadingController, IonModal } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { ObrasService } from '../../services/obras.service';
import { PerfilService } from '../../services/perfil.service';
import { CatalogsService } from '../../services/catalogs.service';
import { CondicionesModalComponent } from '../../components/condiciones-modal/condiciones-modal.component';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline, calendarOutline, attachOutline } from 'ionicons/icons';
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
  perfil: any = {};
  editoras:any = [];
  generos:any = [];
  isEdit = false;
  mostrarErrorCondiciones = false;
  contrato_coautores_url!: File;
  mostrarErrorContrato = false;
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
    private perfilService: PerfilService,
    private catalogsService: CatalogsService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      'attach-outline': attachOutline,
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline,
      'calendar-outline': calendarOutline
    });
  }

  async ngOnInit() {
    this.editoras = await this.catalogsService.getEditoras();
    this.generos = await this.catalogsService.getGeneros();
    this.perfilService.getProfile().subscribe({
      next: (data) => {
        this.perfil = data;
        const nombre = data?.name || '';
        const apellido = data?.lastname || '';
        this.obra.autor = `${nombre} ${apellido}`.trim();
      }
    })
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      const data = await firstValueFrom(this.obrasService.getById(id));

      this.obra = {
        ...data,
        usa_ia: !!data.usa_ia,
        porcentaje_ia: data.porcentaje_ia ?? null,
        lpublico: data.lpublico ? data.lpublico.split(',').map((v: string) => v.trim()) : [],
        colaboradores: Array.isArray(data.colaboradores) ? data.colaboradores : [],
        contrato_coautores_url: data.contrato_coautores_url || '', // <-- importante        
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
        contrato_coautores_url: '',
        usa_ia: false,
        uso_ia: '',
        porcentaje_ia: null,
        lugarPublicacion: [] as string[],
        colaboradores: [],
        aceptaCondiciones: false,
      };
    }
  }

  onEditoraSelected(editora: any) {
    // Guardas lo que tú necesitas
    this.obra.editora_id = editora?.id ?? null;
    this.obra.editora_nombre = editora?.nombre ?? '';
  }

  onGeneroSelected(item: any) {
    // si "generos" es array de objetos { id, nombre }
    this.obra.genero = item?.nombre ?? item;   // si viniera string, cae en item
    this.obra.genero_id = item?.id ?? null;    // opcional si necesitas id
  }

  onContratoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files?.[0];
      this.contrato_coautores_url = input.files?.[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.obra.contrato_coautores_url = reader.result as string; // base64
      };
      reader.readAsDataURL(file);      
    }
  }

  async onSubmit() {

    const loading = await this.loadingCtrl.create({
      message: 'Registrando obra...',
      backdropDismiss: false
    });

    await loading.present();

    try {

      // 🔹 1) Validaciones básicas
      const hayCoautores = (this.obra.colaboradores?.length || 0) > 0;

      if (hayCoautores && !this.contrato_coautores_url && !this.isEdit) {
        this.mostrarErrorContrato = true;
        await loading.dismiss();
        return;
      }

      // 🔹 2) SUBIR CONTRATO (AQUÍ VA)
      if (hayCoautores && this.contrato_coautores_url) {
        const res = await firstValueFrom(
          this.obrasService.uploadFile(this.contrato_coautores_url)
        );

        this.obra.contrato_coautores_url = res.file;
      }

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
        comentario: this.obra.comentarios,
        contrato_coautores_url: hayCoautores ? this.obra.contrato_coautores_url : null
      };

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
      const toast = await this.toastCtrl.create({
        message: 'Error al guardar la obra',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
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