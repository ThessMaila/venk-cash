import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private messageService: MessageService) {}

    succes(message: string): void {
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: message, life: 3000 });
    }

    erreur(message: string): void {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: message, life: 5000 });
    }

    avertir(message: string): void {
        this.messageService.add({ severity: 'warn', summary: 'Attention', detail: message, life: 4000 });
    }

    information(message: string): void {
        this.messageService.add({ severity: 'info', summary: 'Information', detail: message, life: 3000 });
    }
}
