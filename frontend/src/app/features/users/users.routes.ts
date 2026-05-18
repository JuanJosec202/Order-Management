import { Routes } from '@angular/router';
import { UserFormPageComponent } from './pages/user-form-page.component';
import { UsersListPageComponent } from './pages/users-list-page.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersListPageComponent
  },
  {
    path: 'new',
    component: UserFormPageComponent
  },
  {
    path: ':id/edit',
    component: UserFormPageComponent
  }
];
