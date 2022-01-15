import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../../../security/authentication.service';


@Component({
  selector: 'app-birth-features',
  templateUrl: './birth-features.component.html',
  styleUrls: ['./birth-features.component.scss']
})
export class BirthFeaturesComponent {

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
  birthTypeSelectBoxList = [
    {
      name: "Normal vajinal ",
      value: "Normal vajinal "
    },{
      name: "Planlı sezaryen",
      value: "planlı sezaryen"
    },{
      name: "Acil sezaryen ",
      value: "Acil sezaryen "
    }];


  isPregnancyInfectionInfoList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isPregnancyInfectionInfoOption = {
    dataSource: this.isPregnancyInfectionInfoList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value){
        this.generalEvaluationForm.pregnancyInfectionInfo = null;
      }
    }
  };
  isPregnancyMedicineUsageInfoList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isPregnancyMedicineUsageInfoOption = {
    dataSource: this.isPregnancyMedicineUsageInfoList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.pregnancyMedicineUsageInfo = null;
      }
      else {
        this.generalEvaluationForm.pregnancyMedicineUsageInfo = "";
      }
    }
  };
  isApgarScorelist = [{name:'Evet', value: true},{name:'Hayır', value: false}];
  isApgarScoreOption = {
    dataSource: this.isApgarScorelist,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.apgarScore = 0;
      }

    }
  };
  isBirthAnoxialist = [{name:'Var', value: true},{name:'Yok', value: false}];
  isBirthAnoxiaOption = {
    dataSource: this.isBirthAnoxialist,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBirthEmpurplinglist = [{name:'Var', value: true},{name:'Yok', value: false}];
  isBirthEmpurplingOption = {
    dataSource: this.isBirthEmpurplinglist,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBirthCryinglist = [{name:'Var', value: true},{name:'Yok', value: false}];
  isBirthCryingOption = {
    dataSource: this.isBirthCryinglist,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };


  isHighBloodPressorPregnancyList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isHighBloodPressorPregnancyOption = {
    dataSource: this.isHighBloodPressorPregnancyList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };

  isPregnancyDrinkingList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isPregnancyDrinkingOption = {
    dataSource: this.isPregnancyDrinkingList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isPregnancySmokingList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isPregnancySmokingOption = {
    dataSource: this.isPregnancySmokingList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isIntensiveCareList = [{name:'Kaldı', value: true},{name:'Kalmadı', value: false}];
  isIntensiveCareOption = {
    dataSource: this.isIntensiveCareList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.intensiveCare = 0;
      }
    }
  };

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

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
