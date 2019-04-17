import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControladoresPage } from './controladores.page';
import { Vibration } from '@ionic-native/vibration/ngx';

/// ------------- Material Imports------------ /////
import { MatButtonModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
//// -----------Component Import ------------ //////
import { DialogConnectToBluetoothComponent } from './dialog-connect-to-bluetooth/dialog-connect-to-bluetooth.component';
import { StateTableComponent } from './state-table/state-table.component';
import { ManualComponent } from './manual/manual.component';
import { AutomaticoComponent } from './automatico/automatico.component';


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
    MatDialogModule,
    IonicModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatDividerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ControladoresPage, StateTableComponent, ManualComponent, AutomaticoComponent, DialogConnectToBluetoothComponent],
  entryComponents: [DialogConnectToBluetoothComponent],
  providers: [Vibration]
})
export class ControladoresPageModule { }
