import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { PrevisionSocialService } from '../../services/prevision-social.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prevision-social',
  templateUrl: './prevision-social.component.html',
  styleUrls: ['./prevision-social.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class PrevisionSocialComponent {
  ayudas: any[] = [];
  ayudasFiltradas: any[] = [];
  mostrarFiltros = false;
  tiposAyuda = [ 
    { id: 1, nombre: 'Médica' },
    { id: 2, nombre: 'Fallecimiento' },
    { id: 3, nombre: 'Préstamo' },
    { id: 4, nombre: 'Otro' }
  ];
  filtros = {
    tip_ayuda: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''    
  };

  constructor(private previsionService: PrevisionSocialService) {
    addIcons({funnel, funnelOutline, addCircleOutline });
  }

  ngOnInit() {
    this.cargarAyudas();
  }

  ionViewWillEnter() {
    this.cargarAyudas();
  }

  async cargarAyudas() {
    this.ayudas = await firstValueFrom(this.previsionService.getAll());
    this.ayudasFiltradas = [...this.ayudas];    
    console.log(this.ayudas);
  }

  filtrarAyudas() {
    this.ayudasFiltradas = this.ayudas.filter((ayuda:any) => {

      const coincideTipo = this.filtros.tip_ayuda === '' || ayuda.tip_ayuda === this.filtros.tip_ayuda;
      const coincideEstado = this.filtros.estado === '' || ayuda.estado?.toString() === this.filtros.estado;
      const fechaAyuda = ayuda.created_at ? new Date(ayuda.created_at) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaAyuda || !desde || fechaAyuda >= desde) &&
                            (!fechaAyuda || !hasta || fechaAyuda <= hasta);      

      return coincideTipo && coincideEstado && coincideFecha;
    });
    console.log(this.ayudasFiltradas);
  }

  limpiarFiltros() {
    this.filtros = {
      tip_ayuda: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarAyudas();
  }


  estadoTextoMap: Record<number, string> = {
    1: 'Nueva',
    2: 'Validada',
    3: 'Registrada',
    4: 'Rechazada'
  };

  estadoColorMap: Record<number, string> = {
    1: 'secondary',
    2: 'primary',
    3: 'success',
    4: 'danger'
  };

  tipoAyudaTextoMap: { [key: number]: string } = {
    1: 'Médica',
    2: 'Falecimiento',
    3: 'Préstamo',
    4: 'Otros'
  };  

}
