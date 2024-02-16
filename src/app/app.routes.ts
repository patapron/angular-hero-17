import { Routes } from '@angular/router';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';

export const routes: Routes = [
  { path: 'hero-list', component: HeroListComponent },
  { path: 'hero-detail/:id', component: HeroDetailComponent },
  { path: '', redirectTo: '/hero-list', pathMatch: 'full' },
  { path: '**', redirectTo: '/hero-list' }
];
