import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export interface PerfilUsuario {
  id: string;
  numero_socio: string;
  ipi: string;
  name: string;
  lastname: string;
  seudonimo?: string;
  foto?: string;
  genero?: string;
  estado_civil?: number | null;
  nom_conyuge?: string;
  lug_nacimiento?: number | null;
  nacionalidad?: number | null;
  fec_nacimiento?: string;
  identdoc?: 'C' | 'P' | '';
  cedula?: string | null;
  pasaporte?: string | null;
  telefono?: string;
  celular?: string;
  email: string;
  direccion?: string;
  sector?: string;
  provincia?: number | null;
  municipio?: number | null;
  fechaFallecimiento?: string;
  heredero: boolean;
  heredero_data: {
    activo: boolean;
    her_nom: string | null;
    her_tel: string | null;
    her_dir: string | null;
  };
  otra_sociedad: boolean;
  sociedad_data: {
    activa: boolean;
    soc_nom: string | null;
    soc_ubi: string | null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private STORAGE_KEY = 'perfil_usuario';

  constructor() {}
}