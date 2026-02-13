import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { RepartosService } from '../../services/repartos.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-repartos',
  templateUrl: './repartos.component.html',
  styleUrls: ['./repartos.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class RepartosComponent  implements OnInit {
  repartos: any[] = [];
  repartosFiltrados: any[] = [];
  mostrarFiltros = false;
  filtros = {
    fechaDesde: '',
    fechaHasta: ''    
  };

  constructor(private repartosService: RepartosService) {addIcons({funnel, funnelOutline, calendarOutline})}

  ngOnInit() {
    this.cargarRepartos();
  }

  ionViewWillEnter() {
    this.cargarRepartos();
  }  

  async cargarRepartos() {
    this.repartos = await firstValueFrom(this.repartosService.getAll());
    this.repartosFiltrados = [...this.repartos];
  }

  filtrarRepartos() {
    this.repartosFiltrados = this.repartos.filter(reparto => {
      const fechaReparto = reparto.fecha ? new Date(reparto.fecha) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaReparto || !desde || fechaReparto >= desde) &&
                            (!fechaReparto || !hasta || fechaReparto <= hasta);      

      return coincideFecha;
    });
  }

  limpiarFiltros() {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarRepartos();
  }  
}