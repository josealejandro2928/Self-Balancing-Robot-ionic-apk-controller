import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AjusteControladoresPage } from './ajuste-controladores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AjusteControladoresPage
      }
    ])
  ],
  declarations: [AjusteControladoresPage]
})
export class AjusteControladoresPageModule { }
