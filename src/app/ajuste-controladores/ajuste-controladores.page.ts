import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ajuste-controladores',
  templateUrl: 'ajuste-controladores.page.html',
  styleUrls: ['ajuste-controladores.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AjusteControladoresPage implements OnInit {

  PIDConstantForm: FormGroup;
  ParametrosFrom: FormGroup;

  constructor(private fb: FormBuilder) {
    this.BuildForms();

  }

  ngOnInit() {
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

  }

  onObtenerConstantesPID_I(): void {

  }

  onEnviarConstantesPID_V(): void {

  }

  onObtenerConstantesPID_V(): void {

  }
  onEnviarConstantesPID_W(): void {

  }

  onObtenerConstantesPID_W(): void {

  }

  onEnviarParametrosRobot(): void {

  }

  onObtenerParametrosRobot(): void {

  }


}
