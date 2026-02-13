import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CatalogsService {

  private nacionalidades: any[] | null = null;
  private paises: any[] | null = null;
  private provincias: any[] | null = null;
  private municipiosCache: Record<number, any[]> = {};
  private editoras: any[] | null = null;
  private motivos: any[] | null = null;
  private generos: any[] | null = null;

  constructor(private http: HttpClient) {}

  async getNacionalidades() {
    if (this.nacionalidades) return this.nacionalidades;

    this.nacionalidades = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/catalogs/nacionalidades`)
    );

    return this.nacionalidades;
  }

  async getPaises() {
    if (this.paises) return this.paises;

    this.paises = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/catalogs/paises`)
    );

    return this.paises;
  }

  async getProvincias() {
    if (this.provincias) return this.provincias;

    this.provincias = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/catalogs/ciudades/provincias`)
    );

    return this.provincias;
  }

  async getMunicipios(provinciaId: number) {
    if (this.municipiosCache[provinciaId]) {
      return this.municipiosCache[provinciaId];
    }

    const municipios = await firstValueFrom(
      this.http.get<any[]>(
        `${environment.apiUrl}/catalogs/ciudades/municipios/${provinciaId}`
      )
    );

    this.municipiosCache[provinciaId] = municipios;
    return municipios;
  }

  async getEditoras() {
    if (this.editoras) return this.editoras;

    this.editoras = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/catalogs/editoras`)
    );

    return this.editoras;
  }  

  async getMotivos() {
    if (this.motivos) return this.motivos;

    this.motivos = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/catalogs/motivos`)
    );

    return this.motivos;
  } 

  async getGeneros() {
    if (this.generos) return this.generos;

    this.generos = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/catalogs/generos`)
    );

    return this.generos;
  }    

  /** útil para logout */
  clearCache() {
    this.nacionalidades = null;
    this.paises = null;
    this.provincias = null;
    this.municipiosCache = {};
    this.editoras = null;
    this.motivos = null;
  }
}
