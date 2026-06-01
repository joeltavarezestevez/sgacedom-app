import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, NavController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { PrestamoService } from '../../services/prestamos.service';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline, attachOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prestamos-form',
  templateUrl: './prestamos-form.component.html',
  styleUrls: ['./prestamos-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, SgHeaderComponent]
})
export class PrestamosFormComponent implements OnInit {
  prestamo: any = {};
  isEdit = false;
  arc_soporte!: File;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private prestamoService: PrestamoService
  ) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline,
      'attach-outline': attachOutline
    });     
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.prestamo = { ...this.prestamoService.getById(id) };
    } else {
      this.prestamo = {};
    }
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando solicitud...',
      backdropDismiss: false
    });

    await loading.present(); 

    try {

      const res = await firstValueFrom(this.prestamoService.uploadFile(this.arc_soporte));
      
      console.log(res);
      
      this.prestamo.arc_soporte = res.file;

      const payload = {
        motivo_prestamo: this.prestamo.motivo_prestamo,
        arc_soporte: this.prestamo.arc_soporte,
        coment_directiva: this.prestamo.coment_directiva
      };      
      
      if (this.isEdit) {
        await firstValueFrom(this.prestamoService.update(this.prestamo.id, payload));
      } else {
        await firstValueFrom(this.prestamoService.create(payload));
      }

      const toast = await this.toastCtrl.create({
        message: this.isEdit ? 'Solicitud de Prestamo actualizada correctamente': 'Solicitud de Prestamo creada correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.prestamo = {};
      this.navCtrl.navigateBack('/prestamos');

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
        this.prestamo.arc_soporte = reader.result as string; // base64
      };
      reader.readAsDataURL(file);      
    }
  }  
}
