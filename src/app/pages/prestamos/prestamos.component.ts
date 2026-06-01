import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { PrestamoService } from '../../services/prestamos.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { funnel, funnelOutline, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, SgHeaderComponent],
  standalone: true,
})
export class PrestamosComponent {
  prestamos: any[] = [];
  prestamosFiltradas: any[] = [];
  mostrarFiltros = false;
  filtros = {
    estado: '',
    fechaDesde: '',
    fechaHasta: ''    
  };

  constructor(private prestamoService: PrestamoService) {
    addIcons({funnel, funnelOutline, addCircleOutline });
  }

  ngOnInit() {
    this.cargarPrestamos();
  }

  ionViewWillEnter() {
    this.cargarPrestamos();
  }

  async cargarPrestamos() {
    this.prestamos = await firstValueFrom(this.prestamoService.getAll());
    this.prestamosFiltradas = [...this.prestamos];    
    console.log(this.prestamos);
  }

  filtrarPrestamos() {
    this.prestamosFiltradas = this.prestamos.filter((prestamo:any) => {

      const coincideEstado = this.filtros.estado === '' || prestamo.estado?.toString() === this.filtros.estado;
      const fechaPrestamo = prestamo.created_at ? new Date(prestamo.created_at) : null;
      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;
      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const coincideFecha = (!fechaPrestamo || !desde || fechaPrestamo >= desde) &&
                            (!fechaPrestamo || !hasta || fechaPrestamo <= hasta);      

      return coincideEstado && coincideFecha;
    });
    console.log(this.prestamosFiltradas);
  }

  limpiarFiltros() {
    this.filtros = {
      estado: '',
      fechaDesde: '',
      fechaHasta: ''      
    };
    this.filtrarPrestamos();
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
