import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../security/authentication.service";
import {TokenDto} from "../../../../models/tokendto";
import {UserService} from "../../../../shared/services/user.service";
import {AppliedSurgery} from "../../../../models/generalevaluationform/appliedsurgery";
import {OrthesisInfo} from "../../../../models/generalevaluationform/orthesisinfo";
import {OtherOrthesisInfo} from "../../../../models/generalevaluationform/otherorthesisinfo";
import {UsedMedicine} from "../../../../models/generalevaluationform/usedmedicine";
import {CoexistingDiseases} from "../../../../models/generalevaluationform/coexistingdisease";
import {ExpectationsAboutProgram} from "../../../../models/generalevaluationform/expectationsaboutprogram";
import {DxFileUploaderComponent, DxRadioGroupComponent} from "devextreme-angular";
import {Hyperbilirubinemia} from "../../../../models/generalevaluationform/hyperbilirubinemia";
import {AfterBirthReasonCerebralPalsy} from "../../../../models/generalevaluationform/afterbirthreasoncerebralpalsy";
import {VisualImpairment} from "../../../../models/generalevaluationform/visualimpairment";
import {HearingImpairment} from "../../../../models/generalevaluationform/hearingimpairment";
import {PhysiotherapyPast} from "../../../../models/generalevaluationform/physiotherapypast";
import {PhysiotheraphyCentral} from "../../../../models/generalevaluationform/physiotheraphycentral";
import notify from "devextreme/ui/notify";
import {Patient} from "../../../../models/patient";

import "devextreme-intl";
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
// import trMessages from 'devextreme/localization/messages/tr.json';

@Component({
  selector: 'app-demographic-features',
  templateUrl: './demographic-features.component.html',
  styleUrls: ['./demographic-features.component.scss']
})
export class DemographicFeaturesComponent implements OnInit {
  @ViewChild("eventRadioGroupMultiplePregnancy") eventRadioGroup: DxRadioGroupComponent;
  @ViewChild("dxFileUploaderComponentBotoxReport") eventBotoxReport: DxFileUploaderComponent;

  @Input()
  generalEvaluationForm:any;

  @Output() backStepper: EventEmitter<any> = new EventEmitter();
  @Output() nextStepper: EventEmitter<any> = new EventEmitter();



  loading = false;
  error = '';

  nextbuttonOptions:any = {useSubmitBehavior: false, text: 'İleri', onClick: (Event)=>this.goNextForm(Event),
    width: '130px',type:"default", icon: 'fas fa-arrow-circle-right',};
  backbuttonOptions:any = {useSubmitBehavior: false, text: 'Geri', onClick: ()=>this.goBackForm(),
    icon: 'fas fa-arrow-circle-left', width: '130px',stylingMode:"outlined", type:"outlined", style:"text-align:left"};
  birthDateOption = {
    stylingMode: 'outlined',
    showClearButton:"true",
    useMaskBehavior:"true",
    displayFormat:"shortdate",
    placeholder:'Uygulanma Tarihi',
    // min:"minDate",
    // max:"now",
    // value:"now",
    // disabledDates:"getDisabledDates"
  };


  //For selectbox
  genderSelectBoxList= [
    {
      name: "Erkek",
      value: "Erkek"
    },{
      name: "Kız",
      value: "Kız"
    }];


  constructor(private router: Router,
              private userService: UserService,
              private authenticationService: AuthenticationService) {

    this.userService.patient.subscribe(patient=>{
      console.log("patientpatient",patient);
    });


    // loadMessages(trMessages);
    // locale(navigator.language);
  }


  ngOnInit() {
  }




  goBackForm = () =>{
    this.loading = true;
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

  //validation rules
  checkIsNull = (event)=>{
    return event.value !== null;
  }


}
