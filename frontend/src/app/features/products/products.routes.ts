import { Routes } from '@angular/router';
import { ProductFormPageComponent } from './pages/product-form-page.component';
import { ProductsListPageComponent } from './pages/products-list-page.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductsListPageComponent
  },
  {
    path: 'new',
    component: ProductFormPageComponent
  },
  {
    path: ':id/edit',
    component: ProductFormPageComponent
  }
];
