import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {AuthenticationService} from '../../../../security/authentication.service';
import {Hyperbilirubinemia} from "../../../../models/generalevaluationform/hyperbilirubinemia";


@Component({
  selector: 'app-after-birth-features',
  templateUrl: './after-birth-features.component.html',
  styleUrls: ['./after-birth-features.component.scss']
})
export class AfterBirthFeaturesComponent {

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
  oxygenSupportList = [{name:'Aldı', value: true},{name:'Almadı', value: false}];
  oxygenSupportOption = {
    dataSource: this.oxygenSupportList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  newbornRetinopathyList = [{name:'Oldu', value: true},{name:'Olmadı', value: false}];
  newbornRetinopathyOption = {
    dataSource: this.newbornRetinopathyList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isRespiratuvarDistressSyndromList = [{name:'Oldu', value: true},{name:'Olmadı', value: false}];
  isRespiratuvarDistressSyndromOption = {
    dataSource: this.isRespiratuvarDistressSyndromList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isBronchopulmonaryDysplasiaList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isBronchopulmonaryDysplasiaOption = {
    dataSource: this.isBronchopulmonaryDysplasiaList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHyperbilirubinemiaList = [{name:'Oldu', value: true},{name:'Olmadı', value: false}];
  isHyperbilirubinemiaOption = {
    dataSource: this.isHyperbilirubinemiaList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.hyperbilirubinemia = null;
      }
      else{
        this.generalEvaluationForm.hyperbilirubinemia = new Hyperbilirubinemia();
      }
    }
  };
  isSleptHospitalForHyperbilirubinemiaList = [{name:'Yattı', value: true},{name:'Yatmadı', value: false}];
  isSleptHospitalForHyperbilirubinemiaOption = {
    dataSource: this.isSleptHospitalForHyperbilirubinemiaList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        if( this.generalEvaluationForm.hyperbilirubinemia !==null){
          this.generalEvaluationForm.hyperbilirubinemia.isPhototeraphy = null;
          this.generalEvaluationForm.hyperbilirubinemia.hospitalDayTime = null;
        }
      }
      else{
        this.generalEvaluationForm.hyperbilirubinemia = new Hyperbilirubinemia();
      }
    }
  };
  isPhototeraphyList = [{name:'Aldı', value: true},{name:'Almadı', value: false}];
  isPhototeraphyOption = {
    dataSource: this.isPhototeraphyList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };
  isHypoglycaemiaList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isHypoglycaemiaOption = {
    dataSource: this.isHypoglycaemiaList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
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
