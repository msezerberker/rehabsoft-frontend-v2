import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../../../security/authentication.service';


@Component({
  selector: 'app-physical-appearance',
  templateUrl: './physical-appearance.component.html',
  styleUrls: ['./physical-appearance.component.scss']
})
export class PhysicalAppearanceComponent {

  @Input()
  users;
  @Input()
  generalEvaluationForm:any;

  @Output() backStepper: EventEmitter<any> = new EventEmitter();
  @Output() nextStepper: EventEmitter<any> = new EventEmitter();

  nextbuttonOptions:any = {useSubmitBehavior: false, text: 'İleri', onClick: (Event)=>this.goNextForm(Event),
    width: '130px',type:"default", icon: 'fas fa-arrow-circle-right',};
  backbuttonOptions:any = {useSubmitBehavior: false, text: 'Geri', onClick: ()=>this.goBackForm(),
    icon: 'fas fa-arrow-circle-left', width: '130px',stylingMode:"outlined", type:"outlined", style:"text-align:left"};

  loading = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    console.log("state management---");

  }


  //Patient form event handler end


  // Stepper

  goBackForm = () =>{
    this.backStepper.emit();
  }
  goNextForm = (event)=>{
    // stop here if form is invalid
    if (!event.validationGroup.validate().isValid) {
      return;
    }
    this.nextStepper.emit();
  }

}
