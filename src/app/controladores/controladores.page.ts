import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogConnectToBluetoothComponent } from './dialog-connect-to-bluetooth/dialog-connect-to-bluetooth.component';
import { UtilFunctionsService } from './../ComomServices/util-functions.service';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';


@Component({
  selector: 'app-controladores',
  templateUrl: './controladores.page.html',
  styleUrls: ['./controladores.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControladoresPage implements OnInit, OnDestroy {
  start: any;
  end: any;
  TabsIndex = 0;
  elapsedTime = 0;
  myBtn: any = null;


  constructor(public dialog: MatDialog, public utilService: UtilFunctionsService, private bluetoothSerial: BluetoothSerial) {
    if (!this.utilService.MacAddress) {
      this.utilService.showError('Conéctese con el bluetooth');
    }
  }

  ngOnInit() {
    

  }

  ngOnDestroy() {
    if (this.utilService.MacAddress) {
      this.bluetoothSerial.clear().then(() => { });
    }

  }


  ////////////Tabs////////
  OnTabChange(event): void {
    this.TabsIndex = event;
  }


  //////////Bluetooth///////////
  onConectBluetooth(): void {
    const dialogRef = this.dialog.open(DialogConnectToBluetoothComponent, {
      panelClass: 'app-dialog-connect-to-bluetooth',
      maxWidth: '95vw',
      maxHeight: '100vh',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }


}
