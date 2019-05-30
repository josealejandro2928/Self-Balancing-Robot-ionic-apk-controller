import {
  Component, OnInit, ViewEncapsulation, Input,
  OnChanges, OnDestroy, SimpleChanges, AfterViewInit
} from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { UtilFunctionsService } from './../../ComomServices/util-functions.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Subscription } from 'rxjs';

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
  
  velocity = 0.0;
  angular_velocity = 0.0;
  max_forward_velocity = 0.5; // m/s
  max_backward_velocity = 0.35; // m/s
  max_angular_velocity = 3.0; // rad/s

  holdPosition = false;
  holdPositionSubs: Subscription;

  constructor(private bluetoothSerial: BluetoothSerial,
    private utilService: UtilFunctionsService, private vibration: Vibration) { }

  ngOnInit() {
    this.holdPositionSubs = this.utilService.holdPosition.subscribe((data: any) => {
      if (data.index === this.index) {
        if (data.hold) {
          this.holdPosition = true;
          //console.log('apreto');
        }
        else {
          this.holdPosition = false;
          //console.log('solto');
        }
      }


    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentIndex) {
      this.currentIndex = changes.currentIndex.currentValue;
    }
    if (changes.index) {
      this.index = changes.index.currentValue;
    }

    if (this.index === this.currentIndex && this.utilService.MacAddress) {
    } else {
      this.holdPosition = false;
      this.utilService.resetHoldPosition.next({ index: this.index });

    }

  }

  ngOnDestroy() {
    clearInterval(this.Refrescamiento);
    this.holdPositionSubs.unsubscribe();

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
        this.velocity = this.max_forward_velocity;
        this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
      }


    });

    this.upBtn.addEventListener('touchend', () => {
      this.keys.forward = false;
      this.velocity = 0;
      this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
    });

    /////////////////DOWN//////////////////
    this.downBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.forward) {
        this.keys.backward = true;
        this.velocity = -1.0 * this.max_backward_velocity;
        this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
      }

    });

    this.downBtn.addEventListener('touchend', () => {
      this.keys.backward = false;
      this.velocity = 0;
      this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
    });

    ////////////////LEFT//////////////////////
    this.leftBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.right) {
        this.keys.left = true;
        this.angular_velocity = this.max_angular_velocity;
        this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
      }

    });

    this.leftBtn.addEventListener('touchend', () => {
      this.keys.left = false;
      this.angular_velocity = 0;
      this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
    });

    ////////////////RIGHT//////////////////////
    this.rightBtn.addEventListener('touchstart', () => {
      this.vibration.vibrate(150);
      if (!this.keys.left) {
        this.keys.right = true;
        this.angular_velocity = -1.0 * this.max_angular_velocity;
        this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
      }

    });

    this.rightBtn.addEventListener('touchend', () => {
      this.keys.right = false;
      this.angular_velocity = 0.0;
      this.utilService.setRobotSetPointSpeeds(this.velocity, this.angular_velocity);
    });


  }


}
