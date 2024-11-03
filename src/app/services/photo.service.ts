import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { UserPhoto } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  private tempImage: string | null = null;

  constructor(
    platform: Platform,
    private router: Router
  ) {
    this.platform = platform;
  }

  public getTempImage(): string | null {
    return this.tempImage;
  }

  public async addNewToGallery() {
    try {
      console.log('Iniciando captura de foto');
      
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,  // Cambiado a DataUrl
        // source: CameraSource.Prompt,
        source: CameraSource.Camera,
        quality: 100,
        // width: 300,
        // height: 300,
        correctOrientation: true,
        
      });

      if (capturedPhoto.dataUrl) {
        console.log('Foto capturada exitosamente');
        this.tempImage = capturedPhoto.dataUrl;
        console.log('Imagen temporal guardada');
        this.router.navigate(['/image-crop']);
      } else {
        console.warn('La foto capturada no contiene datos');
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
    }
  }

  public async saveEditedImage(croppedImageBase64: string) {
    try {
      console.log('Iniciando guardado de imagen editada');
      
      const savedImageFile = await this.savePicture(croppedImageBase64);
      this.photos.unshift(savedImageFile);

      await Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
      });

      this.tempImage = null;
      console.log('Imagen guardada y temporal limpiada');
    } catch (error) {
      console.error('Error al guardar la imagen editada:', error);
      throw error;
    }
  }

  private async savePicture(base64Data: string) {
    try {
      const base64String = base64Data.split(',')[1] || base64Data;
      const fileName = `${new Date().getTime()}.jpeg`;
      
      await Filesystem.writeFile({
        path: fileName,
        data: base64String,
        directory: Directory.Data
      });

      if (this.platform.is('hybrid')) {
        const fileUri = await Filesystem.getUri({
          directory: Directory.Data,
          path: fileName
        });
        
        return {
          filepath: fileUri.uri,
          webviewPath: Capacitor.convertFileSrc(fileUri.uri),
        };
      } else {
        return {
          filepath: fileName,
          webviewPath: base64Data
        };
      }
    } catch (error) {
      console.error('Error en savePicture:', error);
      throw error;
    }
  }

  public async loadSaved() {
    try {
      const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
      this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

      if (!this.platform.is('hybrid')) {
        for (let photo of this.photos) {
          const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          });
          photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
      }
    } catch (error) {
      console.error('Error al cargar las fotos guardadas:', error);
    }
  }
}
