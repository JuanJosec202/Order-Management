import { Routes } from '@angular/router';
import { OrderDetailPageComponent } from './pages/order-detail-page.component';
import { OrderFormPageComponent } from './pages/order-form-page.component';
import { OrdersListPageComponent } from './pages/orders-list-page.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrdersListPageComponent
  },
  {
    path: 'new',
    component: OrderFormPageComponent
  },
  {
    path: ':id',
    component: OrderDetailPageComponent
  }
];
