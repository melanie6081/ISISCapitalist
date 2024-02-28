import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SessionComponent } from './session/session.component';
import { JeuComponent } from './jeu/jeu.component';

export const routes: Routes = [
    {path : 'connexion', component:SessionComponent},
    {path:'jeu', component: JeuComponent},
    {path: '',   redirectTo: '/connexion', pathMatch: 'full' }, // route par défaut page de connexion
];
