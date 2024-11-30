import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainPaneComponent } from './main-pane/main-pane.component';
import { PublicLibraryComponent } from './public-library/public-library.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: MainPaneComponent },
      { path: 'public-library', component: PublicLibraryComponent },
      {
        path: 'book-details/:id',
        loadComponent: () => import('./public-library/book-details/book-details.component')
          .then(m => m.BookDetailsComponent)
      }
    ],
  },
];
