import {
  Component, OnInit, ViewEncapsulation, Input,
  OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { UtilFunctionsService } from './../../ComomServices/util-functions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-automatico',
  templateUrl: './automatico.component.html',
  styleUrls: ['./automatico.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutomaticoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() index;
  @Input() currentIndex;
  Refrescamiento: any;
  ReferenciaVelocidadForm: FormGroup;
  PointTrackerForm: FormGroup;

  constructor(private bluetoothSerial: BluetoothSerial,
    private utilService: UtilFunctionsService, private fb: FormBuilder) {
    this.BuildForm();
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentIndex) {
      this.currentIndex = changes.currentIndex.currentValue;
    }
    if (changes.index) {
      this.index = changes.index.currentValue;
    }

    if (this.index !== this.currentIndex) {
      this.utilService.resetHoldPosition.next({ index: this.index });
    }

  }

  ngOnDestroy(): void {
  }

  BuildForm(): void {
    this.ReferenciaVelocidadForm = this.fb.group({
      spLinearVel: [0.0, [Validators.required, Validators.min(-0.6), Validators.max(0.6)]],
      spAngularVel: [0.0, [Validators.required, Validators.min(-3.0), Validators.max(3.0)]]
    });

    this.PointTrackerForm = this.fb.group({
      spPositionX: [0.0, [Validators.required, Validators.min(-5.0), Validators.max(5.0)]],
      spPositionY: [0.0, [Validators.required, Validators.min(-5.0), Validators.max(5.0)]]
    });

  }

  ///////////Referencias de velocidades/////////

  onEnviarReferenciasVelocidades(): void {
    if (this.utilService.MacAddress) {
      const lv = this.ReferenciaVelocidadForm.controls['spLinearVel'].value;
      const wv = this.ReferenciaVelocidadForm.controls['spAngularVel'].value;
      this.utilService.setRobotSetPointSpeeds(lv, wv);
    }

  }

  onParaVelocidades(): void {
    if (this.utilService.MacAddress) {
      this.utilService.setRobotSetPointSpeeds(0.0, 0.0);
    }

  }

  ///////Referencias Posicionales///////

  onEnviarReferenciasdePosicion(): void {
    if (this.utilService.MacAddress) {
      const posX = this.PointTrackerForm.controls['spPositionX'].value;
      const posY = this.PointTrackerForm.controls['spPositionY'].value;
      this.utilService.setRobotPointTraker(posX, posY);
    }

  }

  onParaPointTracker(): void {
    if (this.utilService.MacAddress) {
      this.utilService.setRobotSetPointSpeeds(0.0, 0.0);
    }

  }

  onRestarPointTracker(): void {
    if (this.utilService.MacAddress) {
      this.utilService.resetDynamicalState().then(() => {
        this.utilService.setRobotSetPointSpeeds(0.0, 0.0);
      });
    }


  }







}
