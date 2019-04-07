import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { FlexLayoutModule } from '@angular/flex-layout';

/// -------------Material Imports------------ /////
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material';

//// -----------Component Import ------------ //////
import { DialogConnectToBluetoothComponent } from './dialog-connect-to-bluetooth/dialog-connect-to-bluetooth.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    IonicModule,
    MatDialogModule,
    MatInputModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, DialogConnectToBluetoothComponent],
  entryComponents: [DialogConnectToBluetoothComponent],
  // providers: [MatDialog]
})
export class HomePageModule { }
