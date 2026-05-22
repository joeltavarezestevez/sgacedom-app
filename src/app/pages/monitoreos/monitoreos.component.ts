import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { MonitoreosService } from '../../services/monitoreos.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-monitoreos',
  templateUrl: './monitoreos.component.html',
  styleUrls: ['./monitoreos.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class MonitoreosComponent  implements OnInit {
  monitoreos: any[] = [];
  monitoreosFiltrados: any[] = [];
  mostrarFiltros = false;
  filtros = {
    fechaDesde: '',
    fechaHasta: ''    
  };

  constructor(private monitoreosService: MonitoreosService) {addIcons({funnel, funnelOutline, calendarOutline})}

  ngOnInit() {
    this.cargarMonitoreos();
  }

  ionViewWillEnter() {
    this.cargarMonitoreos();
  }  

  async cargarMonitoreos() {
    this.monitoreos = await firstValueFrom(this.monitoreosService.getAll());
    console.log(this.monitoreos);
    this.monitoreosFiltrados = [...this.monitoreos];
  }

  filtrarMonitoreos() {
    this.monitoreosFiltrados = this.monitoreos.filter(monitoreo => {
      const fechaMonitoreo = monitoreo.fecha ? new Date(monitoreo.fecha) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaMonitoreo || !desde || fechaMonitoreo >= desde) &&
                            (!fechaMonitoreo || !hasta || fechaMonitoreo <= hasta);      

      return coincideFecha;
    });
  }

  limpiarFiltros() {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarMonitoreos();
  }

  mesMap: { [key: number]: string } = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',                            
  };   
}