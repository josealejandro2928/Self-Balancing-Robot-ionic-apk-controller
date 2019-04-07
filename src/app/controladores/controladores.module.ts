import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ControladoresPage } from './controladores.page';

/// -------------Material Imports------------ /////
import { MatButtonModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material';


const routes: Routes = [
  {
    path: '',
    component: ControladoresPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    IonicModule,
    MatInputModule,
    MatTabsModule,
    FlexLayoutModule,
    MatDividerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ControladoresPage]
})
export class ControladoresPageModule { }
