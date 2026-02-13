import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomePage),
  },
  {
    path: 'obras',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/obras/obras.component').then(m => m.ObrasComponent),
  },
  {
    path: 'obras/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/obras-form/obras-form.component').then(m => m.ObrasFormComponent),
  },
  {
    path: 'obras/:id/details',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/obras-detail/obras-detail.component').then(m => m.ObrasDetailComponent),
  },
  {
    path: 'obras/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/obras-form/obras-form.component').then(m => m.ObrasFormComponent),
  },
  {
    path: 'repartos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/repartos/repartos.component').then(m => m.RepartosComponent),
  },
  {
    path: 'repartos/:id/details',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/repartos-detail/repartos-detail.component').then(m => m.RepartosDetailComponent),
  },   
  {
    path: 'reclamaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reclamaciones/reclamaciones.component').then(m => m.ReclamacionesComponent),
  },
  {
    path: 'reclamaciones/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reclamaciones-form/reclamaciones-form.component').then(m => m.ReclamacionesFormComponent),
  }, 
  {
    path: 'reclamaciones/:id/details',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/reclamaciones-detail/reclamaciones-detail.component').then(m => m.ReclamacionesDetailComponent),
  },   
  {
    path: 'ayudas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/prevision-social/prevision-social.component').then(m => m.PrevisionSocialComponent),
  },
  {
    path: 'ayudas/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/prevision-social-form/prevision-social-form.component').then(m => m.PrevisionSocialFormComponent),
  }, 
  {
    path: 'ayudas/:id/details',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/prevision-social-detail/prevision-social-detail.component').then(m => m.PrevisionSocialDetailComponent),
  },   
  {
    path: 'reporte-eventos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reporte-eventos/reporte-eventos.component').then(m => m.ReporteEventosComponent),
  },
  {
    path: 'reporte-eventos/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reporte-eventos-form/reporte-eventos-form.component').then(m => m.ReporteEventosFormComponent),
  }, 
  {
    path: 'reporte-eventos/:id/details',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/reporte-eventos-detail/reporte-eventos-detail.component').then(m => m.ReporteEventosDetailComponent),
  },   
  {
    path: 'faq',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/faq/faq.component').then(m => m.FaqComponent),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
  },
  {
    path: 'contacto',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then(m => m.ContactoComponent),
  },
];
