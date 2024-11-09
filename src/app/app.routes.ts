import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    // redirectTo: 'image-crop',
    // pathMatch: 'full',
  },
  {
    path: 'image-crop',
    loadComponent: () => import('./image-crop/image-crop.page').then( m => m.ImageCropPage)
  },
];
