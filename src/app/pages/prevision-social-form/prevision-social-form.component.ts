import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, NavController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { PrevisionSocialService } from '../../services/prevision-social.service';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prevision-social-form',
  templateUrl: './prevision-social-form.component.html',
  styleUrls: ['./prevision-social-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, SgHeaderComponent]
})
export class PrevisionSocialFormComponent implements OnInit {
  prevision: any = {};
  isEdit = false;
  arc_soporte!: File;
  tiposAyuda = ['Médica', 'Fallecimiento', 'Préstamo', 'Otro'];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private previsionService: PrevisionSocialService
  ) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline
    });     
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.prevision = { ...this.previsionService.getById(id) };
    } else {
      this.prevision = {};
    }
  }

  async onSubmit() {
    if (!this.prevision.tip_ayuda || (this.prevision.tip_ayuda === 4 && !this.prevision.desc_otros)) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor completa todos los campos requeridos.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando solicitud...',
      backdropDismiss: false
    });

    await loading.present(); 

    try {

      const res = await firstValueFrom(this.previsionService.uploadFile(this.arc_soporte));
      
      console.log(res);
      
      this.prevision.arc_soporte = res.file;

      const payload = {
        tip_ayuda: this.prevision.tip_ayuda,
        desc_otros: this.prevision.tip_ayuda == 4 ? this.prevision.desc_otros : null,
        motivo_ayuda: this.prevision.motivo_ayuda,
        arc_soporte: this.prevision.arc_soporte,
        coment_directiva: this.prevision.coment_directiva
      };      
      
      if (this.isEdit) {
        await firstValueFrom(this.previsionService.update(this.prevision.id, payload));
      } else {
        await firstValueFrom(this.previsionService.create(payload));
      }

      const toast = await this.toastCtrl.create({
        message: this.isEdit ? 'Solicitud de Ayuda actualizada correctamente': 'Solicitud de Ayuda creada correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.prevision = {};
      this.navCtrl.navigateBack('/ayudas');

    } catch (err: any) {
      const message =
        err?.error?.message ||
        'Ocurrió un error al guardar la solicitud';

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files?.[0];
      this.arc_soporte = input.files?.[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.prevision.arc_soporte = reader.result as string; // base64
      };
      reader.readAsDataURL(file);      
    }
  }  
}
