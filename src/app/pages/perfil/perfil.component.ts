import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService, PerfilUsuario } from '../../services/configuracion.service';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from 'src/app/components/sg-header/sg-header.component';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { CatalogsService } from '../../services/catalogs.service';
import { firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, SgHeaderComponent],
})
export class PerfilComponent implements OnInit {
  user: any = null;
  urlBase = 'https://app.sgacedom.org';
  municipiosSeleccionados:any = null;
  listaNacionalidades:any = [];
  provincias:any = [];
  listaLugaresNacimiento:any = [];
  fotoCambiada = false;
  nuevaFoto!: File;
  nombreFoto = '';

  constructor(
    private configuracionService: ConfiguracionService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private perfilService:PerfilService, 
    private modalCtrl: ModalController,
    private catalogsService: CatalogsService
    ) {}

  async ngOnInit() {
    //this.perfil = await this.authService.getUser();
    this.perfilService.getProfile().subscribe({
      next: (data) => {
        this.perfil = {
          ...this.perfil,
          ...data,
          nacionalidad: data.nacionalidad ? Number(data.nacionalidad) : null,
          lug_nacimiento: data.lug_nacimiento ? Number(data.lug_nacimiento) : null,
          estado_civil: data.estado_civil ? Number(data.estado_civil) : null,
          fec_nacimiento: data.fec_nacimiento ? new Date(data.fec_nacimiento).toISOString().split('T')[0] : '',
          heredero: data.heredero === 1 ? true : false,
          heredero_data: {
            activo: data.heredero === 1 ? true : false,
            her_nom: data.her_nom,
            her_tel: data.her_tel,
            her_dir: data.her_dir,
          },
          otra_sociedad: data.otra_sociedad === 1 ? true : false,
          sociedad_data: {
            activa: data.otra_sociedad === 1 ? true : false,
            soc_nom: data.soc_nom,
            soc_ubi: data.soc_ubi,
          }
        };
        if (!this.perfil?.foto) {
          this.perfil.foto = 'assets/img/user.png';
        }
        else {
          this.perfil.foto = `https://app.sgacedom.org${this.perfil.foto}`;
        }

        if (this.perfil.provincia) {
          this.loadMunicipios(this.perfil.provincia);
        }        

      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'No se pudo cargar el perfil',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });

    // catálogos
    this.listaNacionalidades = await this.catalogsService.getNacionalidades();
    this.listaLugaresNacimiento = await this.catalogsService.getPaises();
    this.provincias = await this.catalogsService.getProvincias();
    this.authService.loadUser();

    this.authService.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);
    });

  }

  async verImagen(url?: string) {
    console.log(url);
    if (!url) return;
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        imageUrl: this.getFileUrl(url)
      },
      showBackdrop: true,
      backdropDismiss: true
    });

    await modal.present();
  }

  getFileUrl(file: string): string {
    return file.startsWith('http') ? file : this.urlBase + file;
  }  

  perfil: PerfilUsuario = {
    id: '',
    numero_socio: '',
    ipi: '',
    name: '',
    lastname: '',
    seudonimo: '',
    nom_conyuge: '',
    identdoc: '',
    cedula: null,
    pasaporte: null,
    telefono: '',
    email: '',
    direccion: '',
    sector: '',
    provincia: null,
    municipio: null,
    genero: '',
    nacionalidad: null,
    estado_civil: null,
    fec_nacimiento: '',
    lug_nacimiento: null,
    fechaFallecimiento: '',
    heredero: false,
    otra_sociedad: false,
    heredero_data: {
      activo: false,
      her_nom: null,
      her_tel: null,
      her_dir: null
    },
    sociedad_data: {
      activa: false,
      soc_nom: null,
      soc_ubi: null
    }
  };

  passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };

  loading = false;  

  async onProvinciaChange() {
    this.perfil.municipio = null;
    if (this.perfil.provincia) {
      await this.loadMunicipios(Number(this.perfil.provincia));
    }

  }

  private async loadMunicipios(provinciaId: number) {
    this.municipiosSeleccionados = await this.catalogsService.getMunicipios(provinciaId);
  }

  async onFotoActualizada(nuevaFotoUrl: string) {
    this.user.foto = nuevaFotoUrl;
    await this.authService.setUser(this.user);
  }

  async guardarPerfil() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando perfil...',
      backdropDismiss: false
    });

    await loading.present(); 

    try {

      if (this.fotoCambiada) {
        const res = await firstValueFrom(
          this.perfilService.uploadPhoto(this.nuevaFoto)
        );
        
        this.perfil.foto = res.file;
        this.onFotoActualizada(res.file);
      }
      console.log(this.perfil);
      const payload = {
        ...this.perfil,
        foto: this.perfil.foto?.replace('https://app.sgacedom.org', '')
      };      
      await firstValueFrom(this.perfilService.updateProfile(payload));

      // 2️⃣ Cambiar contraseña (solo si se escribió algo)
      if (this.passwordForm.new) {
        await firstValueFrom(
          this.perfilService.changePassword({
            currentPassword: this.passwordForm.current,
            newPassword: this.passwordForm.new,
            confirmPassword: this.passwordForm.confirm
          })
        );
      }

      const toast = await this.toastCtrl.create({
        message: 'Perfil actualizado correctamente',
        duration: 2000,
        color: 'success'
      });

      toast.present();
      
      this.loading = false;
      this.fotoCambiada = false;
      this.passwordForm = { current: '', new: '', confirm: '' };
      this.navCtrl.navigateBack('/home');

    } catch (err: any) {
      const message =
        err?.error?.message ||
        'Ocurrió un error al guardar el perfil';

      const toast = await this.toastCtrl.create({
        message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files?.[0];
      this.nuevaFoto = input.files?.[0];
      this.fotoCambiada = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.perfil.foto = reader.result as string; // base64
      };
      reader.readAsDataURL(file);      
    }
  }

  formatearCampo(valor: string | undefined, tipo: 'telefono' | 'cedula' | 'pasaporte'): string {
    if (!valor) return '';
    const limpio = valor.replace(/\D/g, '');

    switch (tipo) {
      case 'telefono':
        return limpio.replace(/^(\d{3})(\d{3})(\d{0,4})$/, '($1) $2-$3').trim();
      case 'cedula':
        return limpio.replace(/^(\d{3})(\d{7})(\d{1})$/, '$1-$2-$3').trim();
      case 'pasaporte':
        return valor.toUpperCase();
      default:
        return valor;
    }
  }


}
