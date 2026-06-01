import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { ReclamacionService } from '../../services/reclamacion.service';
import { CatalogsService } from '../../services/catalogs.service';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline, addCircleOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reclamaciones',
  templateUrl: './reclamaciones.component.html',
  styleUrls: ['./reclamaciones.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, FormsModule, SgHeaderComponent],
  standalone: true,
})
export class ReclamacionesComponent implements OnInit {
  reclamaciones: any = [];
  reclamacionesFiltradas: any = [];
  motivos:any = [];
  mostrarFiltros = false;
  filtros = {
    titulos: '',
    motivo: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''    
  };  

  constructor(
    private reclamacionService: ReclamacionService,
    private catalogsService: CatalogsService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({funnel, funnelOutline, addCircleOutline });
  }

  async ngOnInit() {
    this.cargarReclamaciones();
    this.motivos = await this.catalogsService.getMotivos();
  }

  async ionViewWillEnter() {
    this.cargarReclamaciones();
    this.motivos = await this.catalogsService.getMotivos();
  }

  async cargarReclamaciones() {
    this.reclamaciones = await firstValueFrom(this.reclamacionService.getAll());
    console.log(this.reclamaciones);
    this.reclamacionesFiltradas = [...this.reclamaciones];
  }

  filtrarReclamaciones() {
    this.reclamacionesFiltradas = this.reclamaciones.filter((reclamacion:any) => {
      const coincideTitulos = !this.filtros.titulos || reclamacion.titulos?.toLowerCase().includes(this.filtros.titulos.toLowerCase());
      const coincideMotivo = !this.filtros.motivo || reclamacion.motivos_id === this.filtros.motivo;
      const coincideEstado = this.filtros.estado === '' || reclamacion.estado?.toString() === this.filtros.estado;

      const fechaReclamacion = reclamacion.created_at ? new Date(reclamacion.created_at) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaReclamacion || !desde || fechaReclamacion >= desde) &&
                            (!fechaReclamacion || !hasta || fechaReclamacion <= hasta);      

      return coincideTitulos && coincideMotivo && coincideEstado && coincideFecha;
    });
    console.log(this.reclamacionesFiltradas);
  }

  limpiarFiltros() {
    this.filtros = {
      titulos: '',
      motivo: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarReclamaciones();
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

  motivoTextoMap: { [key: number]: string } = {
    1: 'Me falta un % de mis derechos',
    2: 'Obra No Pagada',
    3: 'Otro Motivo'
  };  

}
