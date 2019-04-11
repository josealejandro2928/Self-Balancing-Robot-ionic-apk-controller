import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { UtilFunctionsService } from './../../ComomServices/util-functions.service';



export interface RobotVariable {
  variableTitle: string;
  valor: number;
  media: number;
  varianza: number;
  suma: number;
  suma_var: number;
}


@Component({
  selector: 'app-state-table',
  templateUrl: './state-table.component.html',
  styleUrls: ['./state-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StateTableComponent implements OnInit, OnDestroy, OnChanges {
  dataSource = new MatTableDataSource<any>([]);
  counter = 0;
  displayedColumns = ['variable', 'valor', 'media', 'varianza'];
  @Input() index;
  @Input() currentIndex;
  Refrescamiento: any;
  velLineal = 0.0;
  velAngular = 0.0;
  inclinacion = 0.0
  bateria = 0.0;
  robotVariables: RobotVariable[] = [
    { variableTitle: 'Inclinación', valor: 0.0, media: 0.0, varianza: 0.0, suma: 0.0, suma_var: 0.0 },
    { variableTitle: 'Velocidad Lineal', valor: 0.0, media: 0.0, varianza: 0.0, suma: 0.0, suma_var: 0.0 },
    { variableTitle: 'Velocidad Angular', valor: 0.0, media: 0.0, varianza: 0.0, suma: 0.0, suma_var: 0.0 },
  ];


  constructor(private bluetoothSerial: BluetoothSerial,
    private utilService: UtilFunctionsService) { }

  ngOnInit() {
    this.InitTable();


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
      this.robotVariables.forEach(item => {
        item.valor = 0.0;
        item.media = 0.0;
        item.varianza = 0.0;
      });
      this.Refrescamiento = setInterval(() => this.getEstado(), 153);
    } else {
      clearInterval(this.Refrescamiento);
      this.counter = 0;
      this.robotVariables.forEach(item => {
        item.valor = 0.0;
        item.media = 0.0;
        item.varianza = 0.0;
      });

    }

  }

  ngOnDestroy() {
    clearInterval(this.Refrescamiento);
    this.Refresh();

  }

  InitTable(): void {
    this.dataSource = new MatTableDataSource<any>(this.robotVariables);
  }

  getEstado(): void {
    this.utilService.getRobotState().then(() => {
      let estado = [];
      for (let i = 0; i < 4; i++) {
        this.bluetoothSerial.readUntil('\n').then((data: String) => {
          if (data && data !== '' && data.length > 1) {
            estado.push(data);
            if (i === 3) {
              this.velLineal = parseFloat(estado[0]);
              this.velAngular = parseFloat(estado[1]);
              this.inclinacion = parseFloat(estado[2]);
              this.utilService.bateria = parseFloat(estado[3]);
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

      this.robotVariables[0].valor = this.inclinacion;
      this.robotVariables[0].suma += this.utilService.CopyObject(this.inclinacion);
      this.robotVariables[0].media = this.utilService.CopyObject(this.robotVariables[0].suma) / this.counter;
      this.robotVariables[0].suma_var += Math.pow((this.inclinacion - this.robotVariables[0].media), 2);
      this.robotVariables[0].varianza = Math.sqrt((this.robotVariables[0].suma_var) / this.counter);

      /////////////////////////////////////////////////////////////////////////////

      this.robotVariables[1].valor = this.velLineal;
      this.robotVariables[1].suma += this.utilService.CopyObject(this.velLineal);
      this.robotVariables[1].media = this.utilService.CopyObject(this.robotVariables[1].suma) / this.counter;
      this.robotVariables[1].suma_var += Math.pow((this.velLineal - this.robotVariables[1].media), 2);
      this.robotVariables[1].varianza = Math.sqrt((this.robotVariables[1].suma_var) / this.counter);

      /////////////////////////////////////////////////////////////////////////////

      this.robotVariables[2].valor = this.velAngular;
      this.robotVariables[2].suma += this.utilService.CopyObject(this.velAngular);
      this.robotVariables[2].media = this.utilService.CopyObject(this.robotVariables[2].suma) / this.counter;
      this.robotVariables[2].suma_var += Math.pow((this.velAngular - this.robotVariables[2].media), 2);
      this.robotVariables[2].varianza = Math.sqrt((this.robotVariables[2].suma_var) / this.counter);

    }
    this.InitTable();
  }

  Refresh() {
    clearInterval(this.Refrescamiento);
    this.counter = 0;
    this.robotVariables.forEach(item => {
      item.valor = 0.0;
      item.media = 0.0;
      item.varianza = 0.0;
    });
    this.Refrescamiento = setInterval(() => this.getEstado(), 153);
  }



}
