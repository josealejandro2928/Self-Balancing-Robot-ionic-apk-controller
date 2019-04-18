import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit, OnDestroy {

  _unsubscribeall: Subject<any>;
  images: any = [];

  constructor(private bluetoothSerial: BluetoothSerial) {
    this._unsubscribeall = new Subject();
    this.images = ['/assets/MyRobot.svg', '/assets/balanduino.jpg', '/assets/FotoAponer3.jpg']

  }

  ngOnInit(): void {


  }

  ngOnDestroy(): void {
    this._unsubscribeall.next();
    this._unsubscribeall.complete();

  }


  // onConectBluetooth(): void {
  //   console.log('pepe')
  //   const dialogRef = this.dialog.open(DialogConnectToBluetoothComponent, {
  //     panelClass: 'app-dialog-connect-to-bluetooth',
  //     maxWidth: '95vw',
  //     maxHeight: '100vh',
  //     data: {

  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //     }
  //   });

  // }

}
