import { Routes } from '@angular/router';
import { ProductManagementComponent } from './components/product-management/product-management.component';

export const routes: Routes = [
    { path: 'product-management', component: ProductManagementComponent },
    { path: '**', component: ProductManagementComponent },
];
