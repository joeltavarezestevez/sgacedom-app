import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { ReclamacionService } from 'src/app/services/reclamacion.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { logoYoutube, logoApple, logoAmazon, videocam, document } from 'ionicons/icons';

@Component({
  selector: 'app-reclamaciones-detail',
  templateUrl: './reclamaciones-detail.component.html',
  styleUrls: ['./reclamaciones-detail.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, SgHeaderComponent],  
})
export class ReclamacionesDetailComponent  implements OnInit {
  reclamacion: any = {};

  constructor(
    private route: ActivatedRoute,
    private reclamacionService: ReclamacionService, 
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      'logo-youtube': logoYoutube,
      'logo-apple': logoApple,
      'logo-amazon': logoAmazon,
      'videocam': videocam,
      'document': document,
      'arrow-back-outline': arrowBackOutline
    });       
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.reclamacionService.getById(id).subscribe({
      next: (data) => {
        this.reclamacion = data;
        console.log(this.reclamacion);
      },
      error: async (response) => {
        console.log(response);
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: response.error.message,
          buttons: ['OK'],
        });
        await alert.present();        
        this.navCtrl.navigateBack('/reclamaciones');
      }      
    });
  }

  estadoTextoMap: Record<number, string> = {
    1: 'Nueva',
    2: 'Revisada',
    3: 'Completada',
    4: 'Cancelada'
  };

  estadoColorMap: Record<number, string> = {
    1: 'secondary',
    2: 'primary',
    3: 'success',
    4: 'danger'
  };


}
