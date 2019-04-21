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
  listToggle = false;
  pairedDeviceID = 0;
  dataSend = 0.0;
  MacAddress = '';

  //////// Variables de Estado /////////
  velocidadLinear = 0.00;
  velocidadAngular = 0.00;
  inclinacion = 0.00;
  robot_X = 0.0;
  robot_Y = 0.0;
  robot_Orientacion = 0.0;
  aceleracion = 0.0;
  bateria = 0.0;
  //////////////////////////////////////

  Kc_i = 0.0; Kc_v = 0.0; Kc_w = 0.0;
  Ki_i = 0.0; Ki_v = 0.0; Ki_w = 0.0;
  Kd_i = 0.0; Kd_v = 0.0; Kd_w = 0.0;
  sp_velocityForm = new FormControl(null, [Validators.required, Validators.min(-1.0), Validators.max(1.0)]);
  sp_angular_velocityForm = new FormControl(null, [Validators.required, Validators.min(-5.0), Validators.max(5.0)]);
  SelectedDevice = new SelectionModel(true);
  CANTIDAD_DATA_BLUETOOTH = 7;



  constructor(public dialogRef: MatDialogRef<DialogConnectToBluetoothComponent>,
    @Inject(MAT_DIALOG_DATA) private dataDialog: any, private spinnerDialog: SpinnerDialog,
    private bluetoothSerial: BluetoothSerial, public utilService: UtilFunctionsService) {
    this.dialogRef.disableClose = true;
    if (utilService.MacAddress) {
      this.SelectedDevice.select(utilService.MacAddress);
      this.MacAddress = this.utilService.MacAddress;
    }

    this.spinnerDialog.show('Espere', 'Verificando la Conexion');
    this.bluetoothSerial.isConnected().then(success => {
      this.utilService.showToast('Dispositivo Conectado');
      this.spinnerDialog.hide();
      this.listToggle = true;
      this.checkBluetoothEnabled();

    }, error => {
      this.utilService.showError('Dispositivo no conectado');
      this.spinnerDialog.hide();
      this.checkBluetoothEnabled();
      this.utilService.MacAddress = null;
      this.listToggle = false;
    });

  }


  ngOnInit() {

  }


  onGuardar(): void { }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.utilService.showError('Por favor habilite el Bluetooth');
      this.utilService.MacAddress = null;
      this.listToggle = false;
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.utilService.showError('Por favor habilite el Bluetooth');
      this.utilService.MacAddress = null;
      this.listToggle = false;
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
    // console.log(this.MacAddress);
  }

  Connect2Device() {
    this.spinnerDialog.show('Espere', 'Conectándose.....');
    if (this.MacAddress.length === 0 || !this.MacAddress) {
      this.utilService.showError('Seleccione algún dispositivo vinculado para conectarse');
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
      this.utilService.showToast('Correctamente conectado');
    }, error => {
      this.spinnerDialog.hide();
      this.utilService.showError('Error:Conectándose con el dispositivo');
      this.utilService.MacAddress = null;
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect().then(success => {
      this.utilService.showToast('Dispositivo Desconectado');
      this.utilService.MacAddress = null;
    },
      error => {
        this.utilService.showError('Error desconectando el dispositivo');
      });

  }

  ////////////////////////////////
  sendSetPoint(): void {
    let v1 = this.sp_velocityForm.value;
    let v2 = this.sp_angular_velocityForm.value;
    this.utilService.setRobotSetPointSpeeds(v1, v2);
  }

  getEstado(): void {
    this.utilService.getRobotState().then(() => {
      let estado = [];
      for (let i = 0; i < this.CANTIDAD_DATA_BLUETOOTH; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === this.CANTIDAD_DATA_BLUETOOTH - 1) {
              this.velocidadLinear = parseFloat(estado[0]);
              this.velocidadAngular = parseFloat(estado[1]);
              this.inclinacion = parseFloat(estado[2]);
              this.robot_X = parseFloat(estado[3]);
              this.robot_Y = parseFloat(estado[4]);
              this.robot_Orientacion = parseFloat(estado[5]);
              this.utilService.bateria = parseFloat(estado[6]);
              this.bluetoothSerial.clear().then(() => { });
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