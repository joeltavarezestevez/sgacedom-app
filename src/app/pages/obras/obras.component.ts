import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { ObrasService } from '../../services/obras.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline } from 'ionicons/icons';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class ObrasComponent implements OnInit {
  obras: any[] = [];
  obrasFiltradas: any[] = [];
  mostrarFiltros = false;
  filtros = {
    titulo: '',
    genero: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''    
  };
    
  constructor(private obrasService: ObrasService) { addIcons({funnel, funnelOutline }); }

  ngOnInit() {
    this.cargarObras();
  }

  ionViewWillEnter() {
    this.cargarObras();
  }

  async cargarObras() {
    this.obras = await firstValueFrom(this.obrasService.getAll());
    this.obrasFiltradas = [...this.obras];
  }

  filtrarObras() {
    this.obrasFiltradas = this.obras.filter(obra => {
      const coincideTitulo = !this.filtros.titulo || obra.titulo?.toLowerCase().includes(this.filtros.titulo.toLowerCase());
      const coincideGenero = !this.filtros.genero || obra.genero?.toLowerCase().includes(this.filtros.genero.toLowerCase());
      const coincideEstado = this.filtros.estado === '' || obra.estado?.toString() === this.filtros.estado;

      const fechaObra = obra.fechaPublicacion ? new Date(obra.fechaPublicacion) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaObra || !desde || fechaObra >= desde) &&
                            (!fechaObra || !hasta || fechaObra <= hasta);      

      return coincideTitulo && coincideGenero && coincideEstado && coincideFecha;
    });
    console.log(this.obrasFiltradas);
  }

  limpiarFiltros() {
    this.filtros = {
      titulo: '',
      genero: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarObras();
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

}
