import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { CatalogsService } from './catalogs.service';
import { isJwtExpired } from '../utils/jwt.util';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private catalogsService: CatalogsService
  ) {}

  /* =======================
      LOGIN
  ======================= */
  async login(numero_socio: string, password: string) {
    const response: any = await this.http
      .post(`${this.apiUrl}/auth/login`, {
        numero_socio,
        password,
      })
      .toPromise();

    await Preferences.set({ key: 'accessToken', value: response.accessToken });
    await Preferences.set({ key: 'refreshToken', value: response.refreshToken });
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(response.user),
    });

    // 🔥 IMPORTANTE: propagar usuario
    this.userSubject.next(response.user);

    return response.user;
  }

  /* =======================
      LOGOUT
  ======================= */
  async logout(): Promise<void> {
    await Preferences.remove({ key: 'accessToken' });
    await Preferences.remove({ key: 'refreshToken' });
    await Preferences.remove({ key: 'user' });

    this.userSubject.next(null); // 👈 limpiar estado
  }

  /* =======================
      CARGAR USUARIO AL INICIO
  ======================= */
  async loadUser(): Promise<any> {
    const { value } = await Preferences.get({ key: 'user' });
    const user = value ? JSON.parse(value) : null;

    this.userSubject.next(user);
    return user;
  }

  /* =======================
      ACTUALIZAR USUARIO (ej: foto)
  ======================= */
  async setUser(user: any): Promise<void> {
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(user),
    });

    this.userSubject.next(user);
  }

  /* =======================
      OBSERVABLE
  ======================= */
  getUserObservable() {
    return this.user$;
  }

  /* =======================
      AUTH CHECK
  ======================= */
  async isAuthenticated(): Promise<boolean> {
    const { value: accessToken } = await Preferences.get({
      key: 'accessToken',
    });

    if (!accessToken || isJwtExpired(accessToken)) {
      await this.logout();
      return false;
    }

    return true;
  }

  async isLoggedIn(): Promise<boolean> {
    return this.isAuthenticated();
  }

  /* =======================
      CATÁLOGOS
  ======================= */
  async preloadCatalogs() {
    await Promise.all([
      this.catalogsService.getNacionalidades(),
      this.catalogsService.getPaises(),
      this.catalogsService.getProvincias(),
    ]);
  }
}
