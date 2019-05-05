import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UtilFunctionsService } from './../ComomServices/util-functions.service';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';


@Component({
  selector: 'app-ajuste-controladores',
  templateUrl: 'ajuste-controladores.page.html',
  styleUrls: ['ajuste-controladores.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AjusteControladoresPage implements OnInit, OnDestroy {

  PIDConstantForm: FormGroup;
  ParametrosFrom: FormGroup;

  constructor(private fb: FormBuilder, private utilService: UtilFunctionsService,
    private bluetoothSerial: BluetoothSerial) {
    this.BuildForms();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.utilService.MacAddress) {
      this.bluetoothSerial.clear().then(() => { });
    }
  }

  BuildForms(): void {
    this.PIDConstantForm = this.fb.group({
      Kc_i: [23.75, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Ki_i: [20.5, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Kd_i: [1.75, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Kc_v: [9.25, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Ki_v: [0.0, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Kd_v: [0.15, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Kc_w: [18.5, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Ki_w: [10.5, [Validators.required, Validators.min(0.0), Validators.max(50.0)]],
      Kd_w: [0.125, [Validators.required, Validators.min(0.0), Validators.max(50.0)]]
    });

    this.ParametrosFrom = this.fb.group({
      radioRuedas: [0.0475, [Validators.required, Validators.min(0.0), Validators.max(0.25)]],
      anguloOffset: [-1.25, [Validators.required, Validators.min(-10.0), Validators.max(10.0)]]
    });

  }

  ////////////////////////////////////////
  onEnviarConstantesPID_I(): void {
    const kc = this.PIDConstantForm.controls['Kc_i'].value;
    const ki = this.PIDConstantForm.controls['Ki_i'].value;
    const kd = this.PIDConstantForm.controls['Kd_i'].value;
    this.utilService.setConstantPIDInclination(kc, ki, kd);
  }

  onObtenerConstantesPID_I(): void {
    for (let k = 0; k < 2; k++) {


    }
    this.utilService.getConstantPIDInclination().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.PIDConstantForm.controls['Kc_i'].setValue(parseFloat(estado[0]));
              this.PIDConstantForm.controls['Ki_i'].setValue(parseFloat(estado[1]));
              this.PIDConstantForm.controls['Kd_i'].setValue(parseFloat(estado[2]));
              this.bluetoothSerial.clear().then(() => { });
            }
          }
        });
      }
    });


  }

  onEnviarConstantesPID_V(): void {
    const kc = this.PIDConstantForm.controls['Kc_v'].value;
    const ki = this.PIDConstantForm.controls['Ki_v'].value;
    const kd = this.PIDConstantForm.controls['Kd_v'].value;
    this.utilService.setConstantPIDVelocity(kc, ki, kd);
  }

  onObtenerConstantesPID_V(): void {
    this.utilService.getConstantPIDVelocity().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.PIDConstantForm.controls['Kc_v'].setValue(parseFloat(estado[0]));
              this.PIDConstantForm.controls['Ki_v'].setValue(parseFloat(estado[1]));
              this.PIDConstantForm.controls['Kd_v'].setValue(parseFloat(estado[2]));
              this.bluetoothSerial.clear().then(() => { });
            }
          }
        });
      }
    });

  }

  onEnviarConstantesPID_W(): void {
    const kc = this.PIDConstantForm.controls['Kc_w'].value;
    const ki = this.PIDConstantForm.controls['Ki_w'].value;
    const kd = this.PIDConstantForm.controls['Kd_w'].value;
    this.utilService.setConstantPIDAngularVelocity(kc, ki, kd);
  }

  onObtenerConstantesPID_W(): void {
    this.utilService.getConstantPIDAngularVelocity().then(() => {
      let estado = [];
      for (let i = 0; i < 3; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 2) {
              this.PIDConstantForm.controls['Kc_w'].setValue(parseFloat(estado[0]));
              this.PIDConstantForm.controls['Ki_w'].setValue(parseFloat(estado[1]));
              this.PIDConstantForm.controls['Kd_w'].setValue(parseFloat(estado[2]));
              this.bluetoothSerial.clear().then(() => { });
            }
          }
        });
      }
    });

  }

  onEnviarParametrosRobot(): void {

  }

  onObtenerParametrosRobot(): void {

  }


}
