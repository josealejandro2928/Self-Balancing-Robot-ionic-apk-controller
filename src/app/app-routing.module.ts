import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'controladores',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'ajuste',
    loadChildren: './ajuste-controladores/ajuste-controladores.module#AjusteControladoresPageModule'
  },
  {
    path: 'controladores',
    loadChildren: './controladores/controladores.module#ControladoresPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
