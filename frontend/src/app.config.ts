import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { intercepteurJwt } from './app/services/intercepteur-jwt.service';

const SonabelPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#e6f7ed',
            100: '#b3e8c9',
            200: '#80d9a6',
            300: '#4dca82',
            400: '#26b961',
            500: '#00853F',
            600: '#007a39',
            700: '#006e32',
            800: '#005d29',
            900: '#004a20',
            950: '#003618'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8faf9',
                    100: '#f1f5f3',
                    200: '#e2e8e6',
                    300: '#cbd5d1',
                    400: '#94a39d',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a'
                }
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
        provideHttpClient(withInterceptors([intercepteurJwt])),
        providePrimeNG({ theme: { preset: SonabelPreset, options: { darkModeSelector: '.app-dark' } } }),
        MessageService
    ]
};
