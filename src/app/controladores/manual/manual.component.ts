import {
  Component, OnInit, ViewEncapsulation, Input,
  OnChanges, OnDestroy, SimpleChanges, AfterViewInit
} from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { UtilFunctionsService } from './../../ComomServices/util-functions.service';
import { Vibration } from '@ionic-native/vibration/ngx';

export interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}



@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManualComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() index;
  @Input() currentIndex;
  Refrescamiento: any;
  keys: Keys = { forward: false, backward: false, left: false, right: false }
  upBtn: any = null;
  downBtn: any = null;
  leftBtn: any = null;
  rightBtn: any = null;
  SAMPLE_TIME = 85;


  velocity = 0.0;
  angular_velocity = 0.0;

  max_velocity = 0.45; // m/s
  lv_step = 0.05;
  max_angular_velocity = 3.0; // rad/s

  constructor(private bluetoothSerial: BluetoothSerial,
    private utilService: UtilFunctionsService, private vibration: Vibration) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentIndex) {
      this.currentIndex = changes.currentIndex.currentValue;
    }
    if (changes.index) {
      this.index = changes.index.currentValue;
    }

    if (this.index === this.currentIndex && this.utilService.MacAddress) {
      this.Refrescamiento = setInterval(() => this.getButtons(), this.SAMPLE_TIME);
    } else {
      clearInterval(this.Refrescamiento);
    }

  }

  ngOnDestroy() {
    clearInterval(this.Refrescamiento);
  }

  ngAfterViewInit() {
    this.upBtn = document.getElementById('upBtn');
    this.downBtn = document.getElementById('downBtn');
    this.leftBtn = document.getElementById('leftBtn');
    this.rightBtn = document.getElementById('rightBtn');

    ///////////// UP/////////////////
    this.upBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.backward) {
        this.keys.forward = true;
      }

    });

    this.upBtn.addEventListener('touchend', () => {
      this.keys.forward = false;
    });

    /////////////////DOWN//////////////////
    this.downBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.forward) {
        this.keys.backward = true;
      }

    });

    this.downBtn.addEventListener('touchend', () => {
      this.keys.backward = false;
    });

    ////////////////LEFT//////////////////////
    this.leftBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.right) {
        this.keys.left = true;
      }

    });

    this.leftBtn.addEventListener('touchend', () => {
      this.keys.left = false;
    });

    ////////////////RIGHT//////////////////////
    this.rightBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.left) {
        this.keys.right = true;
      }

    });

    this.rightBtn.addEventListener('touchend', () => {
      this.keys.right = false;
    });


  }


  getButtons() {
    if (this.keys.forward) {
      this.velocity = Math.min(this.velocity + this.lv_step, this.max_velocity );
    }
    else if (this.keys.backward) {
      this.velocity = Math.max(this.velocity - this.lv_step, -1.0 * this.max_velocity);
    }
    else {
      if (this.velocity > 0) {
        this.velocity = Math.max(this.velocity - this.lv_step, 0.0);
      }
      else if (this.velocity < 0) {
        this.velocity = Math.min(this.velocity + this.lv_step, 0.0);
      }
      else {
        this.velocity = 0.0;
      }
    }
    ////////////////////////////////
    if (this.keys.left) {
      this.angular_velocity = Math.min(this.angular_velocity + 1.0, this.max_angular_velocity);
    }
    else if (this.keys.right) {
      this.angular_velocity = Math.max(this.angular_velocity - 1.0, -1.0 * this.max_angular_velocity);
    }
    else {
      if (this.angular_velocity > 0) {
        this.angular_velocity = Math.max(this.angular_velocity - 1.0, 0.0);
      }
      else if (this.angular_velocity < 0) {
        this.angular_velocity = Math.min(this.angular_velocity + 1.0, 0.0);
      }
      else {
        this.angular_velocity = 0;
      }
    }
    this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);

  }

}
