import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardSubtitle, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { Quote, QuoteResponse } from '../interfaces/interface';
import * as moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonIcon, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCard, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class Tab2Page {

  quoteResponse!: QuoteResponse;
  private citasSubject = new BehaviorSubject<Quote[]>([]);
  citas$ = this.citasSubject.asObservable();

  constructor() {
    addIcons({informationCircleOutline});
    this.loadQuoteResponse();
  }

  async loadQuoteResponse() {
    try {
      const response = await fetch('assets/citas.json'); // Asegúrate de que la ruta sea correcta
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.quoteResponse = await response.json();
      this.addCitas(this.quoteResponse.quotes);
      console.log(this.quoteResponse);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  addCitas(nuevasCitas: Quote[]): boolean {
    const citasActuales = this.citasSubject.getValue();
    
    const citasNoRepetidas = nuevasCitas.filter(nuevaCita => 
      !citasActuales.some(cita => cita.id === nuevaCita.id)
    );
  
    if (citasNoRepetidas.length > 0) {
      this.citasSubject.next([...citasNoRepetidas, ...citasActuales]);
      return true;
    }
    
    return false;
  }

  fecha(fecha: string): string {
    moment.locale('es');
    return moment(fecha).format('l[ a las ]h:mm a');
  }

  totalServicios(cita: Quote): number {
    return cita?.services?.reduce((acc, service) => acc + service.price, 0) || 0;
  }

  cantidadServicios(cita: Quote): number {
    return cita?.services?.length || 0;
  }

  getColor(status: string): any {
    switch (status) {
      case 'RESERVADA':
        return 'blue';
      case 'ACEPTADA':
        return 'blue';
      case 'CANCELADA':
        return 'red';
      case 'TERMINADA':
        return 'green';
    }
  }
}
