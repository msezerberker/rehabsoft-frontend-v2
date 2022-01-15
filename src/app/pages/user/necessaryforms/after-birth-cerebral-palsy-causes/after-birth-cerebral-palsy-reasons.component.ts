import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {AuthenticationService} from '../../../../security/authentication.service';
import {Hyperbilirubinemia} from "../../../../models/generalevaluationform/hyperbilirubinemia";
import {AfterBirthReasonCerebralPalsy} from "../../../../models/generalevaluationform/afterbirthreasoncerebralpalsy";


@Component({
  selector: 'app-after-birth-cerebral-palsy-reasons',
  templateUrl: './after-birth-cerebral-palsy-reasons.component.html',
  styleUrls: ['./after-birth-cerebral-palsy-reasons.component.scss']
})
export class AfterBirthCerebralPalsyReasonsComponent {

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

  //For selectbox
  causesOfAfterBirthCerebralPalsyList = [
    {
      name: "Travma",
      value: "Travma"
    },{
      name: "Beyin tümörleri",
      value: "Beyin tümörleri"
    },{
      name: "Boğulma öyküsü",
      value: "Boğulma öyküsü"
    },{
      name: "Cerrahi sonrası durumlar",
      value: "Cerrahi sonrası durumlar"
    },{
      name: "Kan dolanımı",
      value: "Kan dolanımı"
    },{
      name: "Damar bozuklukları",
      value: "Damar bozuklukları"
    },{
      name: "Beyin kanamaları",
      value: "Beyin kanamaları"
    }];

  isAfterBirthReasonCerebralPalsyList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isAfterBirthReasonCerebralPalsyOption = {
    dataSource: this.isAfterBirthReasonCerebralPalsyList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.afterBirthReasonCerebralPalsy = null;
      }
      else {
        this.generalEvaluationForm.afterBirthReasonCerebralPalsy = new AfterBirthReasonCerebralPalsy();
      }
    }
  };

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

  }

  handleClickCauseForAfterBirthReasonCerebralPalsy = (event) => {
    if(event.value === "Travma"){
      this.generalEvaluationForm.isTraumaVisible = true;
      this.generalEvaluationForm.isBrainTumour = false;
      this.generalEvaluationForm.isAfterSurgerySituation = false;
      this.generalEvaluationForm.isBrainBleedingOrBloodCirculationOrVascularDisorder = false;
    }
    if(event.value === "Beyin tümörleri"){
      this.generalEvaluationForm.isBrainTumour = true;
      this.generalEvaluationForm.isTraumaVisible = false;
      this.generalEvaluationForm.isAfterSurgerySituation = false;
      this.generalEvaluationForm.isBrainBleedingOrBloodCirculationOrVascularDisorder = false;

    }
    if(event.value === "Cerrahi sonrası durumlar"){
      this.generalEvaluationForm.isAfterSurgerySituation = true;
      this.generalEvaluationForm.isBrainTumour = false;
      this.generalEvaluationForm.isTraumaVisible = false;
      this.generalEvaluationForm.isBrainBleedingOrBloodCirculationOrVascularDisorder = false;
    }
    if(event.value === "Kan dolanımı" || event.value === "Damar bozuklukları" || event.value === "Beyin kanamaları"){
      this.generalEvaluationForm.isBrainBleedingOrBloodCirculationOrVascularDisorder = true;
      this.generalEvaluationForm.isAfterSurgerySituation = false;
      this.generalEvaluationForm.isBrainTumour = false;
      this.generalEvaluationForm.isTraumaVisible = false;
    }
  }

  ngOnInit() {
    console.log("state management---");

  }

  checkIsNull = (event)=>{
    return event.value !== null;
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
    this.loading = true;
    this.nextStepper.emit();
  }

}
