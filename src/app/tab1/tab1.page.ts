import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PhotoService } from '../services/photo.service';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonImg, IonCol, IonRow, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonModule],
})
export class Tab1Page implements OnInit {
  public photoService = inject(PhotoService);
  constructor() {
    addIcons({ camera });
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

}
