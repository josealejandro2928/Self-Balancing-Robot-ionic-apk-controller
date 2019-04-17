import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AjusteControladoresPage } from './ajuste-controladores.page';

/// ------------- Material Imports------------ /////
import { MatButtonModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
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
