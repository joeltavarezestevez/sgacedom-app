import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { ReporteEventoService } from '../../services/reporte-evento.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reporte-eventos',
  templateUrl: './reporte-eventos.component.html',
  styleUrls: ['./reporte-eventos.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class ReporteEventosComponent implements OnInit {
  eventos: any[] = [];
  eventosFiltrados: any[] = [];
  mostrarFiltros = false;
  filtros = {
    nombre: '',
    lugar: '',
    tipo: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''    
  };  

  constructor(private reporteEventoService: ReporteEventoService) {
    addIcons({funnel, funnelOutline });
  }

  ngOnInit() {
    this.cargarEventos();
  }

  ionViewWillEnter() {
    this.cargarEventos();
  }

  async cargarEventos() {
    this.eventos = await firstValueFrom(this.reporteEventoService.getAll());
    this.eventosFiltrados = [...this.eventos];    
    console.log(this.eventos);    
  }

  filtrarEventos() {
    this.eventosFiltrados = this.eventos.filter((evento:any) => {

      const coincideNombre = !this.filtros.nombre || evento.nombre_evento?.toLowerCase().includes(this.filtros.nombre.toLowerCase());
      const coincideLugar = !this.filtros.lugar || evento.lugar?.toLowerCase().includes(this.filtros.lugar.toLowerCase());
      const coincideTipo = !this.filtros.tipo || evento.tipo_actividad?.toLowerCase().includes(this.filtros.tipo.toLowerCase());
      const coincideEstado = this.filtros.estado === '' || evento.estado?.toString() === this.filtros.estado;
      const fechaEvento = evento.fecha ? new Date(evento.fecha) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaEvento || !desde || fechaEvento >= desde) &&
                            (!fechaEvento || !hasta || fechaEvento <= hasta);      

      return coincideNombre && coincideLugar && coincideTipo && coincideEstado && coincideFecha;
    });
    console.log(this.eventosFiltrados);
  }

  limpiarFiltros() {
    this.filtros = {
      nombre: '',
      lugar: '',
      tipo: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarEventos();
  }  

  getFechaHoraEvento(evento: any): Date | null {
    if (!evento?.fecha || !evento?.hora) {
      return null;
    }

    // Tomamos solo la fecha YYYY-MM-DD
    const fecha = evento.fecha.split('T')[0];

    // Combinamos fecha + hora
    return new Date(`${fecha}T${evento.hora}`);
  }

  estadoTextoMap: Record<number, string> = {
    1: 'Nuevo',
    2: 'Validado',
    3: 'Recaudado',
    4: 'Rechazado'
  };

  estadoColorMap: Record<number, string> = {
    1: 'secondary',
    2: 'primary',
    3: 'success',
    4: 'danger'
  };

}
