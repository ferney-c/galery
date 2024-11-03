import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/angular/standalone';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.page.html',
  styleUrls: ['./image-crop.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, ImageCropperComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ImageCropPage implements OnInit {

  imageBase64: string = '';
  croppedImage: string = '';
  _imageLoaded = false;

  constructor(
    private photoService: PhotoService,
    private router: Router
  ) {}

  ngOnInit() {
    // Asegurarse de que este código se ejecute en el contexto de Angular
    setTimeout(() => {
      const tempImage = this.photoService.getTempImage();
      console.log('Imagen temporal cargada:', !!tempImage);
      
      if (!tempImage) {
        console.warn('No hay imagen temporal disponible');
        this.router.navigate(['tabs/tab1']);
        return;
      }

      this.loadImage(tempImage);
    }, 0);
  }

  private loadImage(base64Image: string) {
    const img = new Image();
    img.onload = () => {
      console.log('Imagen cargada correctamente');
      this.imageBase64 = base64Image;
    };
    img.onerror = () => {
      console.error('Error al cargar la imagen');
      this.router.navigate(['/prueba']);
    };
    img.src = base64Image;
  }

  imageLoaded() {
    console.log('Imagen cargada en el cropper');
    this._imageLoaded = true;
  }

  loadImageFailed() {
    console.error('Error al cargar la imagen en el cropper');
    this.router.navigate(['/prueba']);
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = event.base64;
    }
  }

  async saveCroppedImage() {
    if (this.croppedImage) {
      try {
        await this.photoService.saveEditedImage(this.croppedImage);
        this.router.navigate(['/prueba']);
      } catch (error) {
        console.error('Error al guardar la imagen:', error);
      }
    }
  }

}
