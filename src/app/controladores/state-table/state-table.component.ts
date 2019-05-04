import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { UtilFunctionsService } from './../../ComomServices/util-functions.service';
import { File } from '@ionic-native/file/ngx';




export interface RobotVariable {
  variableTitle?: string;
  valor?: number;
  media?: number;
  suma?: number;
  unidadMedida?: string;
}


@Component({
  selector: 'app-state-table',
  templateUrl: './state-table.component.html',
  styleUrls: ['./state-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StateTableComponent implements OnInit, OnDestroy, OnChanges {
  dataSource = new MatTableDataSource<RobotVariable>([]);
  counter = 0;
  displayedColumns = ['variable', 'valor', 'media'];
  @Input() index;
  @Input() currentIndex;
  Refrescamiento: any;
  timeTemp: any;
  DataToExport = [];

  CANTIDAD_DATA_BLUETOOTH = 7;
  ////////////////////////////////////////
  velLineal = 0.0;
  velAngular = 0.0;
  inclinacion = 0.0;
  robot_X = 0.0;
  robot_Y = 0.0;
  robot_Orientacion = 0.0;
  aceleracion = 0.0;
  ////////////////////////////////////////
  SAMPLE_TIME = 50; // tiempo en ms
  MAX_TIME_TO_GET_DATA = (10 / this.SAMPLE_TIME) * 1000;

  almacenarDatos = false;
  robotVariables: RobotVariable[] = [
    { variableTitle: 'Posición X', valor: 0.0, media: 0.0, suma: 0.0, unidadMedida: 'm' },
    { variableTitle: 'Posición Y', valor: 0.0, media: 0.0, suma: 0.0, unidadMedida: 'm' },
    { variableTitle: 'Inclinación', valor: 0.0, media: 0.0, suma: 0.0, unidadMedida: 'grad' },
    { variableTitle: 'Velocidad Lineal', valor: 0.0, media: 0.0, suma: 0.0, unidadMedida: 'm/s' },
    { variableTitle: 'Velocidad Angular', valor: 0.0, media: 0.0, suma: 0.0, unidadMedida: 'rad/s' },
    { variableTitle: 'Orientación', valor: 0.0, media: 0.0, suma: 0.0, unidadMedida: 'grad' }

  ];


  constructor(private bluetoothSerial: BluetoothSerial,
    private utilService: UtilFunctionsService, private fileHandle: File) {


  }

  ngOnInit() {
    this.InitTable();
    console.log(this.MAX_TIME_TO_GET_DATA);
    this.timeTemp = setTimeout(() => this.CearDirectorios(), 2000);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentIndex) {
      this.currentIndex = changes.currentIndex.currentValue;
    }
    if (changes.index) {
      this.index = changes.index.currentValue;
    }

    if (this.index === this.currentIndex && this.utilService.MacAddress) {
      this.counter = 0;
      this.RestartArrayData();
      this.Refrescamiento = setInterval(() => this.getEstado(), this.SAMPLE_TIME);
    } else {
      clearInterval(this.Refrescamiento);
      this.counter = 0;
      this.RestartArrayData();
    }

  }

  ngOnDestroy() {
    clearInterval(this.Refrescamiento);
    clearTimeout(this.timeTemp);
    this.counter = 0;
    this.RestartArrayData();
  }

  InitTable(): void {
    this.dataSource = new MatTableDataSource<RobotVariable>(this.robotVariables);
  }

  getEstado(): void {
    this.utilService.getRobotState().then(() => {
      const estado = [];
      for (let i = 0; i < this.CANTIDAD_DATA_BLUETOOTH; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === this.CANTIDAD_DATA_BLUETOOTH - 1) {
              this.velLineal = parseFloat(estado[0]);
              this.velAngular = parseFloat(estado[1]);
              this.inclinacion = parseFloat(estado[2]);
              this.robot_X = parseFloat(estado[3]);
              this.robot_Y = parseFloat(estado[4]);
              this.robot_Orientacion = parseFloat(estado[5]);
              this.utilService.bateria = this.utilService.CopyObject(parseFloat(estado[6]));
              this.getData();
              this.bluetoothSerial.clear().then(() => { });
            }
          }
        });
      }
    });
  }

  getData() {
    this.counter++;
    if (this.counter) {

      if (this.almacenarDatos) {
        if (this.DataToExport.length <= this.MAX_TIME_TO_GET_DATA) {
          this.DataToExport.push(
            {
              robotX: this.utilService.CopyObject(this.robot_X),
              robotY: this.utilService.CopyObject(this.robot_Y),
              inclinacion: this.utilService.CopyObject(this.inclinacion),
              velocidadLineal: this.utilService.CopyObject(this.velLineal),
              velocidadAngular: this.utilService.CopyObject(this.velAngular),
              orientacion: this.utilService.CopyObject(this.robot_Orientacion)
            }
          );
        }
        else {
          this.onStopGettingData();
        }

      }





      ////// POSICION X ///////
      this.robotVariables[0].valor = this.utilService.CopyObject(this.robot_X);
      this.robotVariables[0].suma += this.utilService.CopyObject(this.robot_X);
      this.robotVariables[0].media = this.utilService.CopyObject(this.robotVariables[0].suma) / this.counter;

      ////// POSICION Y ///////
      this.robotVariables[1].valor = this.utilService.CopyObject(this.robot_Y);
      this.robotVariables[1].suma += this.utilService.CopyObject(this.robot_Y);
      this.robotVariables[1].media = this.utilService.CopyObject(this.robotVariables[1].suma) / this.counter;

      ////// INCLINACION ///////
      this.robotVariables[2].valor = this.utilService.CopyObject(this.inclinacion);
      this.robotVariables[2].suma += this.utilService.CopyObject(this.inclinacion);
      this.robotVariables[2].media = this.utilService.CopyObject(this.robotVariables[2].suma) / this.counter;

      ////////VELOCIDAD LINEAL//////
      this.robotVariables[3].valor = this.utilService.CopyObject(this.velLineal);
      this.robotVariables[3].suma += this.utilService.CopyObject(this.velLineal);
      this.robotVariables[3].media = this.utilService.CopyObject(this.robotVariables[3].suma) / this.counter;

      //////VELOCIDAD ANGULAR////////
      this.robotVariables[4].valor = this.utilService.CopyObject(this.velAngular);
      this.robotVariables[4].suma += this.utilService.CopyObject(this.velAngular);
      this.robotVariables[4].media = this.utilService.CopyObject(this.robotVariables[4].suma) / this.counter;

      //////ORIENTACION////////
      this.robotVariables[5].valor = this.utilService.CopyObject(this.robot_Orientacion);
      this.robotVariables[5].suma += this.utilService.CopyObject(this.robot_Orientacion);
      this.robotVariables[5].media = this.utilService.CopyObject(this.robotVariables[5].suma) / this.counter;

      ////////////////////////////////////////////////////////////////////////////////

    }
    this.InitTable();
  }

  Refresh() {
    clearInterval(this.Refrescamiento);
    this.counter = 0;
    this.RestartArrayData();
    if (this.utilService.MacAddress) {
      this.utilService.resetDynamicalState().then(() => {
        this.Refrescamiento = setInterval(() => this.getEstado(), this.SAMPLE_TIME);
      });
    }
  }

  RestartArrayData(): void {
    for (let i = 0; i < this.robotVariables.length; i++) {
      this.robotVariables[i].valor = 0.0;
      this.robotVariables[i].media = 0.0;
      this.robotVariables[i].suma = 0.0;
    }
  }

  onSaveData(): void {
    this.almacenarDatos = true;
    this.DataToExport = [];
  }

  onStopGettingData(): void {
    this.almacenarDatos = false;
    this.WriteDataonMovil(JSON.stringify(this.DataToExport));

  }


  ////////Creando directorios para almacenar archivos/////////
  CearDirectorios(): void {
    if (this.utilService.MacAddress) {
      if (this.index === 0) {
        this.fileHandle.checkDir(this.fileHandle.externalDataDirectory, 'DirectorioManual').then((data) => {
        })
          .catch(err => {
            this.fileHandle.createDir(this.fileHandle.externalDataDirectory, 'DirectorioManual', true).then(() => {
              this.utilService.showToast('Directorio manual creado');

            }).catch(() => {
              this.utilService.showError('Error creando directorio manual');
            });
          });

      } else if (this.index === 1) {
        this.fileHandle.checkDir(this.fileHandle.externalDataDirectory, 'DirectorioAutomatico').then(() => {
        })
          .catch(err => {
            this.fileHandle.createDir(this.fileHandle.externalDataDirectory, 'DirectorioAutomatico', true).then(() => {
              this.utilService.showToast('Directorio automatico creado');

            }).catch(() => {
              this.utilService.showError('Error creando directorio automatico');
            });
          });
      }

    }


  }

  ///////Crear archivos/////////
  WriteDataonMovil(data): void {
    if (this.utilService.MacAddress) {
      if (this.index === 0) {
        this.fileHandle.writeFile(this.fileHandle.externalDataDirectory + '/DirectorioManual', 'DatosManual.txt', data, { replace: true })
          .then(() => {
            this.utilService.showToast('Datos del controlador manual guardados');
          })
          .catch((err) => {
            this.utilService.showError('Error escribiendo archivo');
          });
      }
      else if (this.index === 1) {
        this.fileHandle.writeFile(this.fileHandle.externalDataDirectory + '/DirectorioAutomatico', 'DatosAutomatico.txt', data,
          { replace: true })
          .then(() => {
            this.utilService.showToast('Datos del controlador automático guardados');
          })
          .catch((err) => {
            this.utilService.showError('Error escribiendo archivo');
          });

      }

    }


  }

}
