import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { SelectionModel } from '@angular/cdk/collections';
import { UtilFunctionsService } from './../../ComomServices/util-functions.service';
import { FormControl, Validators } from '@angular/forms';





@Component({
  selector: 'app-dialog-connect-to-bluetooth',
  templateUrl: './dialog-connect-to-bluetooth.component.html',
  styleUrls: ['./dialog-connect-to-bluetooth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogConnectToBluetoothComponent implements OnInit {

  pairedList: PairedList[] = [];
  listToggle = true;
  pairedDeviceID = 0;
  dataSend = 0.0;
  MacAddress = '';
  velocidadLinear = 0.05;
  velocidadAngular = 0.012;
  inclinacion = 0.05;
  Kc_i = 0.0; Kc_v = 0.0; Kc_w = 0.0;
  Ki_i = 0.0; Ki_v = 0.0; Ki_w = 0.0;
  Kd_i = 0.0; Kd_v = 0.0; Kd_w = 0.0;

  sp_velocityForm = new FormControl(null, [Validators.required]);
  sp_angular_velocityForm = new FormControl(null, [Validators.required]);
  SelectedDevice = new SelectionModel(true);



  constructor(public dialogRef: MatDialogRef<DialogConnectToBluetoothComponent>,
    @Inject(MAT_DIALOG_DATA) private dataDialog: any, private spinnerDialog: SpinnerDialog,
    private bluetoothSerial: BluetoothSerial, private utilService: UtilFunctionsService) {
    this.dialogRef.disableClose = true;
    if (utilService.MacAddress) {
      this.SelectedDevice.select(utilService.MacAddress);
      this.MacAddress = this.utilService.MacAddress;
    }

    this.spinnerDialog.show('Espere', 'Verificando la Conexion');
    this.bluetoothSerial.isConnected().then(success => {
      this.utilService.showToast('Dispositivo Conectado');
      this.spinnerDialog.hide();
      this.checkBluetoothEnabled();

    }, error => {
      this.utilService.showError('Dispositivo no conectado');
      this.spinnerDialog.hide();
      this.checkBluetoothEnabled();
    });

  }


  ngOnInit() {
    console.log(this.utilService.convertFloat2Uint8Array(new Float32Array([2.35]), Uint8Array));
    console.log(this.utilService.strToBuffer('2.35'));

  }


  onGuardar(): void { }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.utilService.showError("Por favor habilite el Bluetooth")
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.utilService.showError("Por favor habilite el Bluetooth")
    });
  }

  onSelectChange(address) {
    if (this.SelectedDevice.isSelected(address)) {
      this.SelectedDevice.deselect(address);
      this.MacAddress = '';
    }
    else {
      this.SelectedDevice.clear();
      this.SelectedDevice.select(address);
      this.MacAddress = address;
    }
    console.log(this.MacAddress);
  }

  Connect2Device() {
    this.spinnerDialog.show('Espere', 'Conectándose.....');
    if (this.MacAddress.length === 0 || !this.MacAddress) {
      this.utilService.showError('Seleccione el dispositivo vinculado para conectarse');
      return;
    } else {
      this.utilService.showToast(this.MacAddress);
      this.connect(this.MacAddress);
    }

  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.utilService.MacAddress = address;
      this.spinnerDialog.hide();
      this.utilService.showToast("Successfully Connected");
    }, error => {
      this.spinnerDialog.hide();
      this.utilService.showError("Error:Connecting to Device");
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.utilService.showToast("Device Disconnected");
  }

  handleData(data) {
    this.utilService.showToast(data);
  }

  ////////////////////////////////
  sendSetPoint(): void {
    let v1 = this.sp_velocityForm.value;
    let v2 = this.sp_angular_velocityForm.value;
    this.utilService.setRobotSetPoint(v1, v2);
  }

  getEstado(): void {
    this.utilService.getRobotState().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.velocidadLinear = estado[0];
              this.velocidadAngular = estado[1];
              this.inclinacion = estado[2];
              this.bluetoothSerial.clear().then(() => { });
              this.utilService.showToast(estado);
            }
          }
        });
      }
    });
  }

  sendGetAllPIDConstantes(): void {
    this.utilService.getConstantPIDVelocity().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.Kc_v = estado[0];
              this.Ki_v = estado[1];
              this.Kd_v = estado[2];
              this.bluetoothSerial.clear().then(() => { });
              this.utilService.showToast(estado);
            }
          }
        });
      }
    });


    this.utilService.getConstantPIDAngularVelocity().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.Kc_w = estado[0];
              this.Ki_w = estado[1];
              this.Kd_w = estado[2];
              this.bluetoothSerial.clear().then(() => { });
              this.utilService.showToast(estado);
            }
          }
        });
      }
    });

    this.utilService.getConstantPIDInclination().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.Kc_i = estado[0];
              this.Ki_i = estado[1];
              this.Kd_i = estado[2];
              this.bluetoothSerial.clear().then(() => { });
              this.utilService.showToast(estado);
            }
          }
        });
      }
    });

  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }



}

/////////Interfaces//////////
interface PairedList {
  'class': number;
  'id': string;
  'address': string;
  'name': string;
}