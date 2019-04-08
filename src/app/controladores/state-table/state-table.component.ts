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
      this.Refrescamiento = setInterval(() => this.getData(), 1000);
    } else {
      clearInterval(this.Refrescamiento);
      this.robotVariables.forEach(item => {
        item.valor = 0.0;
        item.media = 0.0;
        item.varianza = 0.0;
      });
      this.counter = 0;
    }

  }

  ngOnDestroy() {
    this.counter = 0;
    clearInterval(this.Refrescamiento);
  }

  InitTable(): void {
    this.dataSource = new MatTableDataSource<any>(this.robotVariables);
  }



  getData() {
    this.counter++;
    //console.log('Tabs: ' + (this.index + '') + ' ' + 'counter: ' + (this.counter + ''));
    let velLineal = Math.random() * 50;
    let velAngular = Math.random() * 25;
    let inclinacion = Math.random() * 12;

    this.robotVariables[0].valor = inclinacion;
    this.robotVariables[0].suma += this.utilService.CopyObject(inclinacion);
    this.robotVariables[0].media = this.utilService.CopyObject(this.robotVariables[0].suma) / this.counter;
    this.robotVariables[0].suma_var += Math.pow((inclinacion - this.robotVariables[0].media), 2);
    this.robotVariables[0].varianza = Math.sqrt((this.robotVariables[0].suma_var) / this.counter);

    /////////////////////////////////////////////////////////////////////////////

    this.robotVariables[1].valor = velLineal;
    this.robotVariables[1].suma += this.utilService.CopyObject(velLineal);
    this.robotVariables[1].media = this.utilService.CopyObject(this.robotVariables[1].suma) / this.counter;
    this.robotVariables[1].suma_var += Math.pow((velLineal - this.robotVariables[1].media), 2);
    this.robotVariables[1].varianza = Math.sqrt((this.robotVariables[1].suma_var) / this.counter);

    /////////////////////////////////////////////////////////////////////////////

    this.robotVariables[2].valor = velAngular;
    this.robotVariables[2].suma += this.utilService.CopyObject(velAngular);
    this.robotVariables[2].media = this.utilService.CopyObject(this.robotVariables[2].suma) / this.counter;
    this.robotVariables[2].suma_var += Math.pow((velAngular - this.robotVariables[2].media), 2);
    this.robotVariables[2].varianza = Math.sqrt((this.robotVariables[2].suma_var) / this.counter);

    this.InitTable();


  }



}
