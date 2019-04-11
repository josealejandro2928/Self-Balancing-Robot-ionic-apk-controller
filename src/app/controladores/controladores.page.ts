import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogConnectToBluetoothComponent } from './dialog-connect-to-bluetooth/dialog-connect-to-bluetooth.component';
import { UtilFunctionsService } from './../ComomServices/util-functions.service';


@Component({
  selector: 'app-controladores',
  templateUrl: './controladores.page.html',
  styleUrls: ['./controladores.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControladoresPage implements OnInit {
  start: any;
  end: any;
  TabsIndex = 0;
  elapsedTime = 0;
  myBtn: any = null;

  constructor(public dialog: MatDialog, public utilService: UtilFunctionsService) {
    if (!this.utilService.MacAddress) {
      this.utilService.showError('Conéctese con el bluetooth');
    }
  }

  ngOnInit() {

  }


  ////////////Tabs////////
  OnTabChange(event): void {
    this.TabsIndex = event;
  }


  //////////Bluetooth///////////
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
