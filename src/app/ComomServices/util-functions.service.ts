import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class UtilFunctionsService {
  MacAddress = null;
  ///////////////////////////////////////
  COMMAND_SETPOINT_SPEEDS = 'A';
  COMMAND_GETSTATE = 'B';
  SET_PID_K_INCLINATION = 'C';
  GET_PID_K_INCLINATION = 'D';
  SET_PID_K_VELOCITY = 'E';
  GET_PID_K_VELOCITY = 'F';
  SET_PID_K_ANGULAR_VELOCITY = 'G';
  GET_PID_K_ANGULAR_VELOCITY = 'H';
  RESET_DYNAMICAL_STATE = 'R';
  POINT_TRACKER_MODE = 'P';
  STOP_POINT_TRACKER_MODE = 'S';
  ///////////////////////////////////////
  bateria: number;

  constructor(private bluetoothSerial: BluetoothSerial, private toastr: ToastrService) {
    this.bateria = 0.0;

  }


  //////Data typing//////
  convertFloat2Uint8Array(src, type): any {
    let buffer = new ArrayBuffer(src.byteLength);
    let baseView = new src.constructor(buffer).set(src);
    return new type(buffer);
  }

  strToBuffer(string): any {
    let arrayBuffer = new ArrayBuffer(string.length * 1);
    let newUint = new Uint8Array(arrayBuffer);
    newUint.forEach((_, i) => {
      newUint[i] = string.charCodeAt(i);
    });
    return newUint;
  }

  CopyObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  ////////Toast///////

  showError(error) {
    this.toastr.error(
      error,
      '',
      {
        timeOut: 5000,
        progressBar: true,
        positionClass: 'toast-bottom-left'
      }
    );

  }

  showToast(msj) {
    this.toastr.success(
      msj,
      '',
      {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      }
    );

  }

  /////////////////////////// INTERFACE TO CONNECT TO ARDUINO ////////////////////////
  getRobotState(): Promise<any> {
    return this.bluetoothSerial.write(this.COMMAND_GETSTATE);
  }

  getConstantPIDInclination(): Promise<any> {
    return this.bluetoothSerial.write(this.GET_PID_K_INCLINATION);
  }

  setConstantPIDInclination(kc: number, ki: number, kd: number): void {
    const data: Uint8Array = this.convertFloat2Uint8Array(new Float32Array([kc, ki, kd]), Uint8Array);
    this.bluetoothSerial.write(this.SET_PID_K_INCLINATION).then(() => {
      this.bluetoothSerial.write(data);
    });

  }



  getConstantPIDVelocity(): Promise<any> {
    return this.bluetoothSerial.write(this.GET_PID_K_VELOCITY);
  }

  setConstantPIDVelocity(kc: number, ki: number, kd: number): void {
    const data: Uint8Array = this.convertFloat2Uint8Array(new Float32Array([kc, ki, kd]), Uint8Array);
    this.bluetoothSerial.write(this.SET_PID_K_VELOCITY).then(() => {
      this.bluetoothSerial.write(data);
    });

  }

  getConstantPIDAngularVelocity(): Promise<any> {
    return this.bluetoothSerial.write(this.GET_PID_K_ANGULAR_VELOCITY);
  }

  setConstantPIDAngularVelocity(kc: number, ki: number, kd: number): void {
    const data: Uint8Array = this.convertFloat2Uint8Array(new Float32Array([kc, ki, kd]), Uint8Array);
    this.bluetoothSerial.write(this.SET_PID_K_ANGULAR_VELOCITY).then(() => {
      this.bluetoothSerial.write(data);
    });
  }



  setRobotSetPointSpeeds(velocity: number, angular_velocity: number) {
    const data: Uint8Array = this.convertFloat2Uint8Array(new Float32Array([velocity, angular_velocity]), Uint8Array);
    this.bluetoothSerial.write(this.COMMAND_SETPOINT_SPEEDS).then(() => {
      this.bluetoothSerial.write(data);
    });
  }

  setRobotPointTraker(posX: number, posY: number) {
    const data: Uint8Array = this.convertFloat2Uint8Array(new Float32Array([posX, posY]), Uint8Array);
    this.bluetoothSerial.write(this.POINT_TRACKER_MODE).then(() => {
      this.bluetoothSerial.write(data);
    });
  }

  stopRobotPointTracker(): Promise<any> {
    return this.bluetoothSerial.write(this.STOP_POINT_TRACKER_MODE);
  }

  resetDynamicalState(): Promise<any> {
    return this.bluetoothSerial.write(this.RESET_DYNAMICAL_STATE);
  }


  ////////////////////////////////////////////////////////////////////////////////////

}
