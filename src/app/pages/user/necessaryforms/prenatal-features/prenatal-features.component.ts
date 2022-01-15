import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../security/authentication.service";

@Component({
  selector: 'app-prenatal-features',
  templateUrl: './prenatal-features.component.html'
})
export class PrenatalFeaturesComponent {


  @Input()
  users;
  @Input()
  generalEvaluationForm:any;

  @Output() backStepper: EventEmitter<any> = new EventEmitter();
  @Output() nextStepper: EventEmitter<any> = new EventEmitter();

  loading = false;

  //For selectbox
  educationLevelList = [
    {
      name: "Okuryazar değil",
      value: "Okuryazar değil"
    },{
      name: "Okuryazar",
      value: "Okuryazar"
    },{
      name: "İlkokul",
      value: "İlkokul"
    },{
      name: "Ortaokul",
      value: "Ortaokul"
    },{
      name: "Yüksek Okul",
      value: "Yüksek Okul"
    },{
      name: "Lisans",
      value: "Lisans"
    },{
      name: "Lisansüstü",
      value: "Lisansüstü"
    }];
  typeOfPregnancyList = [
    {
      name: "Normal",
      value: "Normal"
    },{
      name: "Tüp Bebek",
      value: "Tüp Bebek"
    },{
      name: "Yardımcı Üreme Tekniği",
      value: "Yardımcı Üreme Tekniği"
    }];
  multiplePregnancySelectBoxList = [
    {
      name: "İkiz",
      value: 2
    },{
      name: "Üçüz",
      value: 3
    },{
      name: "Dördüz",
      value: 4
    },{
      name: "Beşiz",
      value: 5
    }];


  isMultiplePregnancyList = [{name:'Var', value: true},{name:'Yok', value: false}];
  isRelativeMarriagelist = [{name:'Var', value: true},{name:'Yok', value: false}];
  isBloodIncompatibilitylist = [{name:'Var', value: true},{name:'Yok', value: false}];
  isMultiplePregnancyOption = {
    dataSource: this.isMultiplePregnancyList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (event)=>{
      if(!event.value) {
        this.generalEvaluationForm.multiplePregnancy = null;
      }
    }
  };
  isRelativeMarriageOption = {
    dataSource: this.isRelativeMarriagelist,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name',
  };
  isBloodIncompatibilityOption = {
    dataSource: this.isBloodIncompatibilitylist,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };


  nextbuttonOptions:any = {useSubmitBehavior: false, text: 'İleri', onClick: (Event)=>this.goNextForm(Event),
    width: '130px',type:"default", icon: 'fas fa-arrow-circle-right',};
  backbuttonOptions:any = {useSubmitBehavior: false, text: 'Geri', onClick: ()=>this.goBackForm(),
    icon: 'fas fa-arrow-circle-left', width: '130px',stylingMode:"outlined", type:"outlined", style:"text-align:left"};

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
    this.loading = true;
    this.nextStepper.emit();
  }

}
