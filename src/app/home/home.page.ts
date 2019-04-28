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
  componentes: any = [];

  constructor(private bluetoothSerial: BluetoothSerial) {
    this._unsubscribeall = new Subject();
    this.images = [
      {
        src: '/assets/balanduino.jpg', titulo: 'Robot Balanduino',
        descripcion: 'Balanduino es un robot autobalanceado de código abierto,' +
          ' compatible con el kit de desarrollo Arduino, puede ser programado y controlado con facilidad.'
      },
      {
        src: '/assets/MyRobot.jpg', titulo: 'Prototipo de mi robot',
        descripcion: 'Para la construcción del "Self-Balancing" de esta tesis, se contó con el uso' +
          ' de la herramienta de diseño gráfico CorelDraw, donde se realizó un boceto del robot.'
      },
      {
        src: '/assets/FotoAponer3.jpg', titulo: 'Puesta en marcha del robot',
        descripcion: 'Una vez ensamblado y programado el robot, se prueba el algoritmo de control de equilibrio.'
      },
      {
        src: '/assets/experimento2Vasos(1).jpg', titulo: 'Control de equilibrio robusto',
        descripcion: 'Para llevar al extremo la capacidad del algoritmo de autobalanceo del robot, se monta encima' +
          ' del chasis dos vasos de agua. El sistema es capaz de evitar el derramamiento del líquido.'
      }
    ];

    this.componentes = [
      {
        src: '/assets/ArduinoMega.jpg', titulo: 'Arduino Mega 2560',
        descripcion: 'Kit de desarrollo, integrado por un microcontrolador Atmel AVR de la familia de microcontroladores RISC.'

      },
      {
        src: '/assets/MPU6050.jpg', titulo: 'Sensor inercial MPU6050',
        descripcion: 'Circuito integrado que posee un giroscopio y un acelerómetro digital de tres ejes. Este sensor constituye' +
          ' el componente principal en el desarrollo del algoritmo de autobalanceo.'
      },
      {
        src: '/assets/motor.jpg', titulo: 'Motores 12VDC con encoders',
        descripcion: '2 motores de 12V con encoders de efecto Hall, poseen cuadratura, una relación de transmición de 30:1' +
          ' y una velocidad máxima de 360 rpm.'
      }

    ];

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
