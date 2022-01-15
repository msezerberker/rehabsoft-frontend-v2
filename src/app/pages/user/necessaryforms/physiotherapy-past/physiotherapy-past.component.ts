import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {AuthenticationService} from '../../../../security/authentication.service';
import {Hyperbilirubinemia} from "../../../../models/generalevaluationform/hyperbilirubinemia";
import {AfterBirthReasonCerebralPalsy} from "../../../../models/generalevaluationform/afterbirthreasoncerebralpalsy";
import {VisualImpairment} from "../../../../models/generalevaluationform/visualimpairment";
import {HearingImpairment} from "../../../../models/generalevaluationform/hearingimpairment";
import {PhysiotherapyPast} from "../../../../models/generalevaluationform/physiotherapypast";
import {PhysiotheraphyCentral} from "../../../../models/generalevaluationform/physiotheraphycentral";


@Component({
  selector: 'app-physiotherapy-past',
  templateUrl: './physiotherapy-past.component.html',
  styleUrls: ['./physiotherapy-past.component.scss']
})
export class PhysiotherapyPastComponent {

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



  isPhysiotherapyPastList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isPhysiotherapyPastOption = {
    dataSource: this.isPhysiotherapyPastList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.physiotherapyPast = null;
      }
      else {
        this.generalEvaluationForm.physiotherapyPast = new PhysiotherapyPast();
      }
    }
  };


  ////************** For 2 Collections in GeneralEvaluationForm bunlar sonra submitte tek tek kontrol edilip oyle collectionlarina set edilecek****************/////

  /// PhysiotherapyCenter in PhysiotherapyPast
  @Input()
  physiotherapyCenterMap:any;
  @Input()
  specialEducationCheckBoxOptions:any;
  @Input()
  medicineCenterCheckBoxOptions:any;

  ////************** For 2 Collections in GeneralEvaluationForm and 1 collection in field end ****************/////

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

  }


  ngOnInit() {
    console.log("state management---");

  }

  checkIsNull = (event)=>{
    return event.value !== null;
  }


  // Stepper

  goBackForm = () =>{
    this.backStepper.emit();
  }
  goNextForm = (event)=>{
    // stop here if form is invalid
    if (!event.validationGroup.validate().isValid) {
      return;
    }
    // let generalEvaluationFormToSendBackend = {...this.generalEvaluationForm};
    this.generalEvaluationForm.physiotherapyPast = this.generatePhysioteraphyPast(this.generalEvaluationForm);
    this.nextStepper.emit();
  }

  private generatePhysioteraphyPast = (generalEvaluationFormToSendBackend:any):PhysiotherapyPast => {
    let physiotherapyPasts:PhysiotherapyPast = {...generalEvaluationFormToSendBackend.physiotherapyPast};
    physiotherapyPasts.physiotherapyCentralCollection = [];
    if(generalEvaluationFormToSendBackend.isPhysiotherapyPast){
      console.log("giriyor-1",generalEvaluationFormToSendBackend.physiotherapyPast);
      if(this.physiotherapyCenterMap[0].value){
        let physiotheraphyCentral = new PhysiotheraphyCentral(this.physiotherapyCenterMap[0].name);
        physiotherapyPasts.physiotherapyCentralCollection.push(physiotheraphyCentral);
      }
      if(this.physiotherapyCenterMap[1].value){
        let physiotheraphyCentral = new PhysiotheraphyCentral(this.physiotherapyCenterMap[1].name);
        physiotherapyPasts.physiotherapyCentralCollection.push(physiotheraphyCentral);
      }
    }
    return physiotherapyPasts;
  }

}
