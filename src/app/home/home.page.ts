import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { MatDialog } from '@angular/material';
import { DialogConnectToBluetoothComponent } from './dialog-connect-to-bluetooth/dialog-connect-to-bluetooth.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit, OnDestroy {

  _unsubscribeall: Subject<any>;

  constructor(private bluetoothSerial: BluetoothSerial, public dialog: MatDialog) {
    this._unsubscribeall = new Subject();

  }

  ngOnInit(): void {


  }

  ngOnDestroy(): void {
    this._unsubscribeall.next();
    this._unsubscribeall.complete();

  }


  onConectBluetooth(): void {
    console.log('pepe')
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
