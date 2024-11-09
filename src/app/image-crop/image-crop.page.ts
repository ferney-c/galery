import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon, IonFooter, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkDoneCircleOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.page.html',
  styleUrls: ['./image-crop.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonFooter, 
    IonIcon,
    IonButton,
    IonButtons,
    ImageCropperComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ImageCropPage implements OnInit {
  imageBase64: string = '';
  croppedImage: string = '';
  _imageLoaded = false;

  #photoService = inject(PhotoService);

  #router = inject(Router);

  constructor() {
    addIcons({closeCircleOutline,checkmarkDoneCircleOutline});
  }

  ngOnInit() {
    // Asegurarse de que este código se ejecute en el contexto de Angular
    setTimeout(() => {
      const tempImage = this.#photoService.getTempImage();
      console.log('Imagen temporal cargada:', !!tempImage);

      if (!tempImage) {
        console.warn('No hay imagen temporal disponible');
        this.#router.navigateByUrl('tabs/tab1', { replaceUrl: true });
        return;
      }

      this.loadImage(tempImage);
    }, 0);
    console.log('Iniciando carga de imagen temporal');
  }

  private loadImage(base64Image: string) {
    const img = new Image();
    img.onload = () => {
      console.log('Imagen cargada correctamente');
      this.imageBase64 = base64Image;
    };
    img.onerror = () => {
      console.error('Error al cargar la imagen');
      this.#router.navigateByUrl('tabs/tab1', { replaceUrl: true });
    };
    img.src = base64Image;
  }

  imageLoaded() {
    console.log('Imagen cargada en el cropper');
    this._imageLoaded = true;
  }

  loadImageFailed() {
    console.error('Error al cargar la imagen en el cropper');
    this.#router.navigateByUrl('tabs/tab1', { replaceUrl: true });
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Evento de recorte recibido');
    if (event.base64) {
      console.log('Datos base64 recibidos del recorte');
      this.croppedImage = event.base64;
    } else if (event.blob) {
      // Alternativa usando blob si base64 no está disponible
      const reader = new FileReader();
      reader.onload = () => {
        this.croppedImage = reader.result as string;
        console.log('Imagen convertida de blob a base64');
      };
      reader.readAsDataURL(event.blob);
    } else {
      console.warn('No se recibieron datos de imagen del recorte');
    }
  }

  async saveCroppedImage() {
    console.log('Intentando guardar imagen recortada');
    if (this.croppedImage) {
      try {
        await this.#photoService.saveEditedImage(this.croppedImage);
        console.log('Imagen guardada exitosamente');
        this.#router.navigateByUrl('tabs/tab1', { replaceUrl: true });
      } catch (error) {
        console.error('Error al guardar la imagen:', error);
      }
    } else {
      console.warn('No hay imagen recortada para guardar');
    }
  }

  cancelCrop() {
    console.log('Cancelando recorte de imagen');
    this.#router.navigateByUrl('tabs/tab1', { replaceUrl: true });
  }
}
