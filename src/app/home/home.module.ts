import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { FlexLayoutModule } from '@angular/flex-layout';

/// -------------Material Imports------------ /////
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material';

//// -----------Component Import ------------ //////


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    IonicModule,
    MatInputModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatDividerModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  entryComponents: [],
  // providers: [MatDialog]
})
export class HomePageModule { }
