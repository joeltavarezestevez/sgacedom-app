import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logInOutline, fingerPrintOutline } from 'ionicons/icons';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../services/auth.service';
import { Browser } from '@capacitor/browser';

const key = 'sg@cedom';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    socio: '',
    password: ''
  };
  hasBiometricCredentials = false;
  hasBiometry: boolean = false;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private toastController: ToastController,
    private faio: FingerprintAIO,
    private authService: AuthService
    ) {
    addIcons({
      'log-in-outline': logInOutline,
      'finger-print-outline': fingerPrintOutline
    });
  }

  ngOnInit() {
    if(this.getBiometricCredentials()) {
      this.loginWithBiometrics();
    }
  }

  async login() {
    if (!this.credentials.socio || !this.credentials.password) {
      return;
    }

    try {
      await this.authService.login(
        this.credentials.socio,
        this.credentials.password
        );

      const biometricCredentials = localStorage.getItem('biometric');
      if (!biometricCredentials) {
        this.checkBiometry();
      }
      await this.authService.preloadCatalogs();
      this.router.navigateByUrl('/perfil', { replaceUrl: true });

    } catch (error) {
      this.errorToastCredenciales();
    }
  }

  async checkBiometry() {
    this.faio.isAvailable({
      requireStrongBiometrics: false,
      allowBackup: true,
    }).then(async (available) => {
      if (available) {
        this.hasBiometry = true;
        const alert = await this.alertController.create({
          header: 'Acceso Biométrico',
          message: '¿Quieres habilitar el acceso biométrico para tu próximo inicio de sesión?',
          backdropDismiss: false,
          buttons: [
            {
              text: 'No, gracias',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Habilitar',
              handler: () => {
                this.saveCredentials(this.credentials);
              }
            }
          ]
        });

        await alert.present();          
      }
    }).catch((error) => {
      this.hasBiometry = false;
      console.log('Biometría no disponible', error);
    });
  }

  private loadBiometricCredentials() {
    try {
      const encryptedData = localStorage.getItem('biometric');
      if (!encryptedData) {
        this.hasBiometricCredentials = false;
        return;
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        this.hasBiometricCredentials = false;
        return;
      }

      JSON.parse(decrypted); // validación
      this.hasBiometricCredentials = true;
    } catch {
      this.hasBiometricCredentials = false;
    }
  }


  async recuperarClave() {
    await Browser.open({
      url: 'https://app.sgacedom.org/password/reset',
      presentationStyle: 'fullscreen'
    });
  }

  async loginWithBiometrics() {
    try {
    // 1. Verificar biometría
      const verified = await this.tryVerify();
      if (!verified) {
        this.errorToast();
        return;
      }

    // 2. Obtener credenciales guardadas
      const credentials = this.getBiometricCredentials();
      if (!credentials) {
        this.errorToastCredenciales();
        return;
      }

    // 3. Autenticar contra el backend
      await this.authService.login(
        credentials.socio,
        credentials.password
        );

    // 4. Entrar solo si el backend valida
      this.router.navigateByUrl('/perfil', { replaceUrl: true });

    } catch (error) {
      console.error('Error login biométrico:', error);
      this.errorToastCredenciales();
    }
  }


/*  private async tryVerify(): Promise<boolean> {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Autenticación con huella',
        title: 'Autenticación con huellas digitales',
        description: 'Inicia sesión utilizando el lector de huellas digitales',
        maxAttempts: 5,
        useFallback: true
      });

      return true; // Si no lanza error, autenticación OK
    } catch (err: any) {
      console.log(err);
      if (err?.message?.includes('Cancel')) {
        console.log('🚫 Usuario canceló');
        return false;
      }
      if (err?.message?.includes('Authentication Failed')) {
        console.warn('❌ Huella no reconocida, reintentando...');
        return false;
      }
      return false;
    }
  }
*/
  private async tryVerify(): Promise<boolean> {
    try {
      await this.faio.show({
        title: 'Autenticación con huellas digitales',
        description: 'Inicia sesión utilizando el lector de huellas digitales',
        disableBackup: false,
      });

      return true;
    } catch (err: any) {
      console.error('Falló la autenticación biométrica:', err);
      return false;
    }
  }

  async saveCredentials(credentials: any) {
    const verified = await this.tryVerify();
    if (!verified) {
      this.errorToast();
      return;
    }

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({
        socio: credentials.socio,
        password: credentials.password
      }),
      key
    ).toString();

    localStorage.setItem('biometric', encryptedData);
  }


  getBiometricCredentials() {
    const encryptedData = localStorage.getItem('biometric');

    if(encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData,key);
      const credentials = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return credentials;
    }
    else {
      return null;
    }
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'No se han podido verificar los datos biométricos',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async errorToastCredenciales() {
    const toast = await this.toastController.create({
      message: 'Número de socio o contraseña incorrectos',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }


}







