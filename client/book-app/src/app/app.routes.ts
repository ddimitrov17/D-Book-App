import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainPaneComponent } from './main-pane/main-pane.component';
import { PublicLibraryComponent } from './public-library/public-library.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { FavoritesShelfComponent } from './favorites-shelf/favorites-shelf.component';
import { FeedComponent } from './feed/feed.component';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { ReviewDetailsComponent } from './feed/review-details/review-details.component';

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
      },
      { path: 'reading-list', component: ReadingListComponent },
      { path: 'favorites-shelf', component: FavoritesShelfComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'my-profile', component: PersonalProfileComponent },
      { path: 'review-details/:id', component: ReviewDetailsComponent },
    ],
  },
];
