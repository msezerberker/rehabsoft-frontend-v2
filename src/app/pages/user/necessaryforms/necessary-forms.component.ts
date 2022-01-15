import {Component, Input, NgModule, ViewChild} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../../security/authentication.service';
import {UserService} from "../../../shared/services/user.service";

import swal, {SweetAlertOptions} from "sweetalert2";
import {Parent} from "../../../models/parent";
import {AppliedSurgery} from "../../../models/generalevaluationform/appliedsurgery";
import {UsedMedicine} from "../../../models/generalevaluationform/usedmedicine";
import {OtherOrthesisInfo} from "../../../models/generalevaluationform/otherorthesisinfo";
import {ExpectationsAboutProgram} from "../../../models/generalevaluationform/expectationsaboutprogram";
import {PhysiotherapyPast} from "../../../models/generalevaluationform/physiotherapypast";
import {PhysiotheraphyCentral} from "../../../models/generalevaluationform/physiotheraphycentral";

@Component({
  selector: 'app-necessary-forms',
  templateUrl: './necessary-forms.component.html',
  styleUrls: ['./necessary-forms.component.scss']
})
export class NecessaryFormsComponent {

  @Input()
  users;
  submitted = false;

  // ***** Tooltip start ***** //
  titleParentInformation = false;
  titleDemographicFeatures = false;
  titlPhysicalFeatures = false;
  titlePrenatalFeatures = false;
  titleBirthFeatures = false;
  titleAfterBirthFeatures = false;
  titleAfterBirthCerebralPalsyReasons = false;
  titleAppliedTreatments = false;
  titleCoexistingDiseases = false;
  titlePhysiotherapyPast = false;
  titleExpectationsAboutProgram = false;
  toggleDefault(whichTitle:string) {
    switch(whichTitle) {
      case 'titleParentInformation': {
        this.titleParentInformation = !this.titleParentInformation;
        break;
      }
      case 'titleDemographicFeatures': {
        this.titleDemographicFeatures = !this.titleDemographicFeatures;
        break;
      }
      case 'titlPhysicalFeatures': {
        this.titlPhysicalFeatures = !this.titlPhysicalFeatures;
        break;
      }
      case 'titlePrenatalFeatures': {
        this.titlePrenatalFeatures = !this.titlePrenatalFeatures;
        break;
      }
      case 'titleBirthFeatures': {
        this.titleBirthFeatures = !this.titleBirthFeatures;
        break;
      }
      case 'titleAfterBirthFeatures': {
        this.titleAfterBirthFeatures = !this.titleAfterBirthFeatures;
        break;
      }
      case 'titleAfterBirthCerebralPalsyReasons': {
        this.titleAfterBirthCerebralPalsyReasons = !this.titleAfterBirthCerebralPalsyReasons;
        break;
      }
      case 'titleAppliedTreatments': {
        this.titleAppliedTreatments = !this.titleAppliedTreatments;
        break;
      }
      case 'titleCoexistingDiseases': {
        this.titleCoexistingDiseases = !this.titleCoexistingDiseases;
        break;
      }
      case 'titlePhysiotherapyPast': {
        this.titlePhysiotherapyPast = !this.titlePhysiotherapyPast;
        break;
      }
      case 'titleExpectationsAboutProgram': {
        this.titleExpectationsAboutProgram = !this.titleExpectationsAboutProgram;
        break;
      }
    }

  }
  // ***** Tooltip end ***** //

  // ******** Patient form variables and methods start************ //
  patientForm:any = {
    parent1: new Parent(),
    parent2: new Parent(),
    phoneNumberListForParent1: [],
    phoneNumberListForParent2: [],
  }
  addPhoneButtonOptions1: any;
  addPhoneButtonOptions2: any;
  phoneOptions1: any[] = [];
  phoneOptions2: any[] = [];
  initializePhoneButtonOptions = () => {
    console.log("------>>>>>>>>>>>>>>>>>> necessary form ---");
    this.addPhoneButtonOptions1 = {
      icon: "add",
      text: "Telefon Ekle",
      onClick: () => {
        this.patientForm.phoneNumberListForParent1.push("");
        this.phoneOptions1 = this.getPhonesOptions1(this.patientForm.phoneNumberListForParent1);
      }
    };

    this.addPhoneButtonOptions2 = {
      icon: "add",
      text: "Telefon Ekle",
      onClick: () => {
        this.patientForm.phoneNumberListForParent2.push("");
        this.phoneOptions2 = this.getPhonesOptions2(this.patientForm.phoneNumberListForParent2);
      }
    };
  }

  //Patient form event handler start
  getPhonesOptions1(phones: any) {
    let options = [];
    for (let i = 0; i < phones.length; i++){
      options.push(this.generateNewPhoneOptions1(i));
    }
    return options;
  }

  getPhonesOptions2(phones: any) {
    let options = [];
    for (let i = 0; i < phones.length; i++){
      options.push(this.generateNewPhoneOptions2(i));
    }
    return options;
  }

  generateNewPhoneOptions1(index: number) {
    return {
      mask: "(X00) 000-0000",
      maskRules: {"X": /[01-9]/},
      buttons: [{
        name: "trash",
        location: "after",
        options: {
          stylingMode: "text",
          icon: "trash",
          onClick: () => {
            this.patientForm.phoneNumberListForParent1.splice(index, 1);
            this.phoneOptions1 = this.getPhonesOptions1(this.patientForm.phoneNumberListForParent1);
          }
        }
      }]
    }
  }
  generateNewPhoneOptions2(index: number) {
    return {
      mask: "(X00) 000-0000",
      maskRules: {"X": /[01-9]/},
      buttons: [{
        name: "trash",
        location: "after",
        options: {
          stylingMode: "text",
          icon: "trash",
          onClick: () => {
            this.patientForm.phoneNumberListForParent2.splice(index, 1);
            this.phoneOptions2 = this.getPhonesOptions2(this.patientForm.phoneNumberListForParent1);
          }
        }
      }]
    }
  }
  // ******** Patient form variables and methods end************ //



  // ******** applied treatments form variables and methods start************ //
  usedMedicineOptions: any[] = [];
  addUsedMedicineButtonOptions: any = {
    icon: "add",
    text: "İlaç Ekle",
    onClick: () => {
      if(this.generalEvaluationForm.usedMedicineCollection === null) {
        this.generalEvaluationForm.usedMedicineCollection = [];
      }
      this.generalEvaluationForm.usedMedicineCollection.push(new UsedMedicine());
      this.usedMedicineOptions = this.getUsedMedicineOptions(this.generalEvaluationForm.usedMedicineCollection);
    }
  };
  private getUsedMedicineOptions(appliedSurgery: any) {
    let options = [];
    for (let i = 0; i < appliedSurgery.length; i++){
      options.push(this.generateNewUsedMedicineOptions1(i));
    }
    return options;
  }
  private generateNewUsedMedicineOptions1(index: number) {
    return [
      { stylingMode: 'outlined',
        placeholder: 'İlaç İsmi',
        maxLength:200
      },
      {
        stylingMode: "text",
        icon: "trash",
        onClick: () => {
          this.generalEvaluationForm.usedMedicineCollection.splice(index, 1);
          this.usedMedicineOptions = this.getUsedMedicineOptions(this.generalEvaluationForm.usedMedicineCollection);
        }
      }
    ];
  }
  appliedSurgeryOptions: any[] = [];
  addAppliedSurgeryButtonOptions: any = {
    icon: "add",
    text: "Cerrahi Ekle",
    onClick: () => {
      if(this.generalEvaluationForm.appliedSurgeryCollection === null) {
        this.generalEvaluationForm.appliedSurgeryCollection = [];
      }
      this.generalEvaluationForm.appliedSurgeryCollection.push(new AppliedSurgery());
      this.appliedSurgeryOptions = this.getAppliedSurgeryOptions(this.generalEvaluationForm.appliedSurgeryCollection);
    }
  };
  customAppliedSurgeriesList = [{
    name: 'Yumuşak doku - kas cerrahisi',
    value: 'Yumuşak doku - kas cerrahisi'
  },{
    name: 'Kemik cerrahisi',
    value: 'Kemik cerrahisi'
  },{
    name: 'Yumuşak doku-kas ve Kemik bir arada',
    value: 'Yumuşak doku-kas ve Kemik bir arada'
  }];
  private getAppliedSurgeryOptions(appliedSurgery: any) {
    let options = [];
    for (let i = 0; i < appliedSurgery.length; i++){
      options.push(this.generateNewAppliedSurgeryOptions1(i));
    }
    return options;
  }
  private generateNewAppliedSurgeryOptions1(index: number) {
    return [
      { stylingMode: 'outlined',
        placeholder: 'Seçiniz, yoksa yazınız...',
        dataSource: this.customAppliedSurgeriesList,
        acceptCustomValue: true,
        valueExpr: 'value',
        displayExpr: 'name',
        onCustomItemCreating: this.onCustomItemCreatingForAppliedSurgerySelectbox
      },
      {
        placeholder: 'Uygulanma Tarihi'
      },
      {
        stylingMode: "text",
        icon: "trash",
        text: "Sil",
        onClick: () => {
          this.generalEvaluationForm.appliedSurgeryCollection.splice(index, 1);
          this.appliedSurgeryOptions = this.getAppliedSurgeryOptions(this.generalEvaluationForm.appliedSurgeryCollection);
        }
      }
    ];
  }
  private onCustomItemCreatingForAppliedSurgerySelectbox = (event)=>{
    const newItem = {
      name: event.text,
      value: event.text
    };
    // this.customAppliedSurgeriesList.push(newItem);
    event.customItem = newItem;
    console.log(event.customItem);
  }
  otherOrthesisOptions: any[] = [];
  addOtherOrthesisButtonOptions: any = {
    icon: "add",
    text: "Ekle",
    onClick: () => {
      if(this.generalEvaluationForm.otherOrthesisInfoCollection === null) {
        this.generalEvaluationForm.otherOrthesisInfoCollection = [];
      }
      this.generalEvaluationForm.otherOrthesisInfoCollection.push(new OtherOrthesisInfo());
      this.otherOrthesisOptions = this.getOtherOrthesisOptions(this.generalEvaluationForm.otherOrthesisInfoCollection);
    }
  };
  private getOtherOrthesisOptions(appliedSurgery: any) {
    let options = [];
    for (let i = 0; i < appliedSurgery.length; i++){
      options.push(this.generateNewOtherOrthesisOptions1(i));
    }
    return options;
  }
  private generateNewOtherOrthesisOptions1(index: number) {
    return [
      { stylingMode: 'outlined',
        placeholder: 'Ortezin tanımı',
        maxLength:200
      },
      {
        stylingMode: "text",
        icon: "trash",
        text: "Sil",
        onClick: () => {
          this.generalEvaluationForm.otherOrthesisInfoCollection.splice(index, 1);
          this.otherOrthesisOptions = this.getOtherOrthesisOptions(this.generalEvaluationForm.otherOrthesisInfoCollection);
        }
      }
    ];
  }
  // ******** applied treatments form variables and methods end************ //

  // ******** coexisting disease form variables and methods start************ //
  coexistingDiseaseMap = [
    {name: 'Bilişsel Problem', value: false},
    {name: 'Duyu Problemi', value: false},
    {name: 'Davranış Problemi',value:  false},
    {name: 'Konuşma Problemi', value: false},
    {name: 'Uyku Problemi', value: false},
    {name: 'Yutma Problemi', value: false},
    {name: 'Kalça Problemi', value: false},
    {name: 'Skolyoz', value: false}
  ];
  // ******** coexisting disease form variables and methods end************ //


  // coexisting disease checkbox start //
  mentalProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[0].value = event.component.option("value");
      this.mentalProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  hearingProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[1].value = event.component.option("value");
      this.hearingProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  behaviorProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[2].value = event.component.option("value");
      this.behaviorProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  speakingProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[3].value = event.component.option("value");
      this.speakingProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  sleepingProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[4].value = event.component.option("value");
      this.sleepingProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  swallowProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[5].value = event.component.option("value");
      this.swallowProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  hipProblemCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[6].value = event.component.option("value");
      this.hipProblemCheckBoxOptions.value = event.component.option("value");
    }
  }
  skolyozCheckBoxOptions = {
    value: null,
    onValueChanged: (event)=>{
      this.coexistingDiseaseMap[7].value = event.component.option("value");
      this.skolyozCheckBoxOptions.value = event.component.option("value");
    }
  }
  // coexisting disease checkbox end //


  //*** Expectation Variables start***//
  expectationsAboutProgramOptions: any[] = [];
  addExpectationsAboutProgramButtonOptions: any = {
    icon: "add",
    text: "Ekle",
    onClick: () => {
      if(this.generalEvaluationForm.expectationsAboutProgramCollection === null) {
        this.generalEvaluationForm.expectationsAboutProgramCollection = [];
      }
      this.generalEvaluationForm.expectationsAboutProgramCollection.push(new ExpectationsAboutProgram());
      this.expectationsAboutProgramOptions = this.getExpectationsAboutProgramOptions(this.generalEvaluationForm.expectationsAboutProgramCollection);
    }
  };
  private getExpectationsAboutProgramOptions(appliedSurgery: any) {
    let options = [];
    for (let i = 0; i < appliedSurgery.length; i++){
      options.push(this.generateNewExpectationsAboutProgramOptions1(i));
    }
    return options;
  }
  private generateNewExpectationsAboutProgramOptions1(index: number) {
    return [
      { stylingMode: 'outlined',
        placeholder: '', maxLength:1000, minHeight: 100
      },
      {
        stylingMode: "text",
        icon: "trash",
        onClick: () => {
          this.generalEvaluationForm.expectationsAboutProgramCollection.splice(index, 1);
          this.expectationsAboutProgramOptions = this.getExpectationsAboutProgramOptions(this.generalEvaluationForm.expectationsAboutProgramCollection);
        }
      }
    ];
  }
  //*** Expectation Variables end***//


  // **** Physiotherapy Past variables start **** //
  physiotherapyCenterMap = [
    {name: 'Özel eğitim ve rehabilitasyon merkezi', value: false},
    {name: 'Tıp merkezi-hastane', value: false},
  ];
  specialEducationCheckBoxOptions = {
    value: null,
    text: 'Özel eğitim ve rehabilitasyon merkezi',
    onValueChanged: (event)=>{
      this.physiotherapyCenterMap[0].value = event.component.option("value");
      this.specialEducationCheckBoxOptions.value = event.component.option("value");
    }
  }
  medicineCenterCheckBoxOptions = {
    value: null,
    text: 'Tıp merkezi-hastane',
    onValueChanged: (event)=>{
      this.physiotherapyCenterMap[1].value = event.component.option("value");
      this.medicineCenterCheckBoxOptions.value = event.component.option("value");
    }
  }
  // **** Physiotherapy Past variables start **** //

  // stepper booleans map
  stepperActiveBooleans = {
    "isPatientStepperActive": true,
    "isDemographicFeaturesStepperActive": false,
    "isPhysicalAppearanceStepperActive": false,
    "isPrenatalFeaturesStepperActive": false,
    "isBirthFeaturesStepperActive": false,
    "isAfterBirthFeaturesStepperActive": false,
    "isAfterBirthCerebralPalsyReasonsStepperActive": false,
    "isAppliedTreatmentsStepperActive": false,
    "isCoexistingDiseasesStepperActive": false,
    "isPhysiotherapyPastStepperActive": false,
    "isExpectationsAboutProgramStepperActive": false,
  };

  stepperClassesMap = {
    "patientStepperClass": 'active',
    "demographicFeaturesStepperClass": '',
    "physicalAppearanceFormStepperClass": '',
    "prenatalFeaturesFormStepperClass": '',
    "birthFeaturesFormStepperClass": '',
    "afterBirthFeaturesFormStepperClass": '',
    "afterBirthCerebralPalsyReasonsFormStepperClass": '',
    "appliedTreatmentsFormStepperClass": '',
    "coexistingDiseasesFormStepperClass": '',
    "physiotherapyPastFormStepperClass": '',
    "expectationsAboutProgramFormStepperClass": ''
  }

  // Stepper
  goPatientForm = () =>{
    console.log("patient form next butonu sonrasi:-----> ",this.patientForm);
    this.setAllFormAttributesFalseExpectThese("isPatientStepperActive", "patientStepperClass");
  }
  goDemographicFeatures = () =>{
    this.setAllFormAttributesFalseExpectThese("isDemographicFeaturesStepperActive", "demographicFeaturesStepperClass");
  }
  goPhysicalAppearance = () =>{
    this.setAllFormAttributesFalseExpectThese("isPhysicalAppearanceStepperActive", "physicalAppearanceFormStepperClass");
  }
  goPrenatalFeatures = () =>{
    this.setAllFormAttributesFalseExpectThese("isPrenatalFeaturesStepperActive", "prenatalFeaturesFormStepperClass");
  }
  goBirthFeatures = () =>{
    this.setAllFormAttributesFalseExpectThese("isBirthFeaturesStepperActive", "birthFeaturesFormStepperClass");
  }
  goAfterBirthFeatures = () =>{
    this.setAllFormAttributesFalseExpectThese("isAfterBirthFeaturesStepperActive", "afterBirthFeaturesFormStepperClass");
  }
  goAfterBirthCerebralPalsyReasons = () =>{
    this.setAllFormAttributesFalseExpectThese("isAfterBirthCerebralPalsyReasonsStepperActive", "afterBirthCerebralPalsyReasonsFormStepperClass");
  }
  goAppliedTreatments = () =>{
    this.setAllFormAttributesFalseExpectThese("isAppliedTreatmentsStepperActive", "appliedTreatmentsFormStepperClass");
  }
  goCoexistingDiseases = () =>{
    this.setAllFormAttributesFalseExpectThese("isCoexistingDiseasesStepperActive", "coexistingDiseasesFormStepperClass");
  }
  goPhysiotherapyPast = () =>{
    this.setAllFormAttributesFalseExpectThese("isPhysiotherapyPastStepperActive", "physiotherapyPastFormStepperClass");
  }
  goExpectationsAboutProgram = () =>{
    this.setAllFormAttributesFalseExpectThese("isExpectationsAboutProgramStepperActive", "expectationsAboutProgramFormStepperClass");
  }

  private setAllFormAttributesFalseExpectThese(expectThisStepperActiveAttribute:string, expectThisFormStepperClass:string){
    Object.keys(this.stepperActiveBooleans).forEach(key=>{
      if(expectThisStepperActiveAttribute===key){
        this.stepperActiveBooleans[expectThisStepperActiveAttribute]=true;
      } else{
        this.stepperActiveBooleans[key]=false;
      }
    });

    Object.keys(this.stepperClassesMap).forEach(key=>{
      if(expectThisFormStepperClass===key){
        this.stepperClassesMap[expectThisFormStepperClass]='active';
      } else{
        this.stepperClassesMap[key]='';
      }
    });
  }


  // Forms
  generalEvaluationForm  = {
    'nameSurname': null,
    'address': null,

    // radiobutton variables for extra information in general eva. form. page to make visible some content on html
    // Hepsini null giricez daha sonra
    isMultiplePregnancy: false,
    isApgarScoreKnown: false,
    isPregnancyInfectionInfo: false,
    isPregnancyMedicineUsageInfo: false,
    isIntensiveCare: false,
    isVisualImpairment: false,
    isHearingImpairment: false,

    // radiobutton variables to create new object like Hyperbilirubinemia to save in Collection
    isHyperbilirubinemia: false,
    isSleptHospitalForHyperbilirubinemia: false,
    isAfterBirthReasonCerebralPalsy: false,
    isBotoxTreatment: false,
    isPhysiotherapyPast: false,

    // orthesis variables, should be deleted and reformatted before submit
    isOrthesisMap: null,
    orthesisMap: null,

    // for selected cause of after birth cerebral parcy. bir sebep secilirse ona ozel aciklama itemi olusuyor. onu visible yapmak icin.
    isTraumaVisible: false,
    isBrainTumour: false,
    isAfterSurgerySituation: false,
    isBloodCirculation: false,
    isBrainBleedingOrBloodCirculationOrVascularDisorder: false,

    // 1. Demografik Bilgiler
    gender: null,
    birthDate: null,
    ageAsMonth: null,
    numberOfSiblings: null,
    whichChild: null,

    // 2. Fiziksel Özellikler
    heightCm: null,
    weightGr: null,
    headRoundCm: null,

    // 3. Dogum Oncesi Ozellikler
    mothersGivenBirthAgeYear: null,
    mothersEducationLevel: null,
    typeOfPregnancy: null,
    fathersEducationLevel: null,
    multiplePregnancy: null,
    isRelativeMarriage: null,
    isBloodIncompatibility: null,

    // 4. Dogum Ozellikler
    birthWeek: null,
    birthType: null,
    birthWeight: null,
    birthHeadAroundCm: null,
    apgarScore: null,
    isBirthAnoxia: null,
    isBirthEmpurpling: null,
    isBirthCrying: null,
    isHighBloodPressorPregnancy: null,
    pregnancyInfectionInfo:null,
    pregnancyMedicineUsageInfo: null,
    isPregnancyDrinking: null,
    isPregnanycSmoking:null,
    id:null,

    // 5.Doğum Sonrası Özellikler
    oxygenSupport: null,
    intensiveCare:null,
    isNewbornRetinopathy: null,
    isRespiratuvarDistressSyndrom: null,
    isBronchopulmonaryDysplasia: null,
    isHypoglycaemia: null,

    //DiseaseOfMotherPregnancy
    diseaseOfMotherPregnancy: null,

    //Hyperbilirubinemia
    hyperbilirubinemia: null,

    //AfterBirthReasonCerebralPalsy
    afterBirthReasonCerebralPalsy: null,

    //Botox_Treatment
    botoxTreatment: null,

    /*
      Many to Many ve.þ Many-To-Onelar buraya geecek
    */
    appliedSurgeryCollection: null,

    //One to many
    orthesisInfoCollection: [],
    otherOrthesisInfoCollection: null,
    usedMedicineCollection: null,

    //ManyToMany
    coexistingDiseasesCollection: null,

    //VisualImpairement
    visualimpairment: null,

    //OneTomany

    //HearingImpairment
    hearingImpairment: null,

    //ExpectationsAboutProgram
    expectationsAboutProgramCollection: [],

    //Epilepsy
    epilepsy: null,

    //Physioterapy Past
    physiotherapyPast: null
  };

  // Orthesis checkbox options
  isOrthesisMap = [
    {name: 'Tabanlık', value: false},
    {name: 'Topuk Kapı', value: false},
    {name: 'Ayak bileği hizasında ortez (supra-malleoler)',value:  false},
    {name: 'Sabit Ayak-ayak bileği ortezi (AFO)', value: false},
    {name: 'Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', value: false},
    {name: 'Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', value: false},
    {name: 'Dinamik ayak ayak bileği ortezi (DAFO)', value: false},
    {name: 'Bacaklar için gece splinti', value: false},
    {name: 'Bacaklar için gece splinti',value:  false},
    {name: 'İmmobilizer', value: false},
    {name: 'Kalça ateli', value: false},
    {name: 'Gövde korsesi', value: false},
    {name: 'Dirsek splinti', value: false},
    {name: 'Baş parmak ortezi', value: false},
  ];
  orthesisMap = new Map([
    ['Tabanlık', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Topuk Kapı', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Ayak bileği hizasında ortez (supra-malleoler)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Sabit Ayak-ayak bileği ortezi (AFO)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Dinamik ayak ayak bileği ortezi (DAFO)', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Bacaklar için gece splinti', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['İmmobilizer', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Kalça ateli', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Gövde korsesi', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Dirsek splinti', new Map([
      ['left', false],
      ['right', false]
    ])],
    ['Baş parmak ortezi', new Map([
      ['left', false],
      ['right', false]
    ])]
  ]);



  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
    authenticationService.currentUser.subscribe(user=>{
      this.generalEvaluationForm['nameSurname'] = user.firstname + ' '+  user.surname;
      this.generalEvaluationForm['address'] = null;
    });
    this.initializePhoneButtonOptions();


    this.generalEvaluationForm['isOrthesisMap'] = this.isOrthesisMap;
    this.generalEvaluationForm['orthesisMap'] = this.orthesisMap;
  }

  ngOnInit() {
  }


  //Patient form event handler end



  // Submit Button
  submit() {

  console.log("submit basladi general form: ",this.generalEvaluationForm);

  //******* codes to test start*******//

  // this.generalEvaluationForm.birthDate = this.generalEvaluationForm.birthDate.toISOString().replace('T',' ').slice(0,-5);
  // console.log("date: ", this.generalEvaluationForm );
  // this.userService.postGeneralEvaluationForm(this.generalEvaluationForm)
  //   .pipe(first())
  //   .subscribe(
  //     data => {
  //       this.router.navigate(['/user/home']);
  //     },
  //     error => {
  //       console.log(error)
  //       this.error = error;
  //       this.loading = false;
  //     });

  //******* codes to test start*******//

  // to add correspond fied into patient and general evaluation form


  console.log();
  let generalEvaluationFormToSendBackend = {...this.generalEvaluationForm};
  this.cleanGeneralEvaluationFormFromBoolean(generalEvaluationFormToSendBackend);

  //change date values to remove ISO
  this.preparingDatesForBackend(generalEvaluationFormToSendBackend);

  this.submitted = true;

  //post general evaluation form and patient
  console.log("tam submit oncesi: ",generalEvaluationFormToSendBackend);

  let patient = {...this.userService.getPatient};
  patient.address =  generalEvaluationFormToSendBackend.address;
  console.log("patient",patient);
  delete generalEvaluationFormToSendBackend.address;

  this.userService.postPatient(patient)
    .pipe(first())
    .subscribe(
      patientData => {
        this.userService.postGeneralEvaluationForm(generalEvaluationFormToSendBackend)
          .pipe(first())
          .subscribe(
            data => {
              // notify(JSON.stringify(data.responseMessage));

              // message is ok
              const options = {
                title: 'Başarılı !',
                icon: 'success',
                text: 'Form Başarılı Bir Şekilde Kaydedildi! ',
                type: 'success',
                heightAuto: false
              } as SweetAlertOptions;
              this.router.navigate(['/user/home']).then((message)=>{
                swal.fire(options).then(() => {
                });
              });

            },
            error => {


              // message is ok
              const options = {
                title: 'Bir Hata meydana geldi !',
                icon: 'error',
                text: error.responseMessage,
                type: 'error',
                heightAuto: false
              } as SweetAlertOptions;

              swal.fire(options).then(() => {
              });

              notify(JSON.stringify(error.responseMessage));
            });
      },
      error => {
        notify(JSON.stringify(error));
      }
    )

  }
  preparingDatesForBackend= (generalEvaluationFormToSendBackend:any) => {
    generalEvaluationFormToSendBackend.birthDate = generalEvaluationFormToSendBackend.birthDate.toISOString().replace('T',' ').slice(0,-5);

    if(generalEvaluationFormToSendBackend.botoxTreatment !==null){
      generalEvaluationFormToSendBackend.botoxTreatment.lastBotoxDate = generalEvaluationFormToSendBackend.botoxTreatment.lastBotoxDate.toISOString().replace('T',' ').slice(0,-5);
    }
    if(generalEvaluationFormToSendBackend.appliedSurgeryCollection !==null)
      generalEvaluationFormToSendBackend.appliedSurgeryCollection.forEach((appliedSurgery,index)=>{
        generalEvaluationFormToSendBackend.appliedSurgeryCollection[index].applyingDate = appliedSurgery.applyingDate.toISOString().replace('T',' ').slice(0,-5);
      });
  }

  cleanGeneralEvaluationFormFromBoolean = (generalEvaluationFormToSendBackend:any) =>{

    delete generalEvaluationFormToSendBackend.isOrthesisMap;
    delete generalEvaluationFormToSendBackend.orthesisMap;
    delete generalEvaluationFormToSendBackend.isPhysiotherapyPast;

    delete generalEvaluationFormToSendBackend.isMultiplePregnancy;
    delete generalEvaluationFormToSendBackend.isApgarScoreKnown;
    delete generalEvaluationFormToSendBackend.isPregnancyInfectionInfo;
    delete generalEvaluationFormToSendBackend.isPregnancyMedicineUsageInfo;
    delete generalEvaluationFormToSendBackend.isIntensiveCare;
    delete generalEvaluationFormToSendBackend.isVisualImpairment;
    delete generalEvaluationFormToSendBackend.isHearingImpairment;
    delete generalEvaluationFormToSendBackend.isHyperbilirubinemia;
    delete generalEvaluationFormToSendBackend.isSleptHospitalForHyperbilirubinemia;
    delete generalEvaluationFormToSendBackend.isAfterBirthReasonCerebralPalsy;
    delete generalEvaluationFormToSendBackend.isBotoxTreatment;
    delete generalEvaluationFormToSendBackend.isPhysiotherapyPast;
    delete generalEvaluationFormToSendBackend.isTraumaVisible;
    delete generalEvaluationFormToSendBackend.isBrainTumour;
    delete generalEvaluationFormToSendBackend.isAfterSurgerySituation;
    delete generalEvaluationFormToSendBackend.isBloodCirculation;
    delete generalEvaluationFormToSendBackend.isBrainBleedingOrBloodCirculationOrVascularDisorder;
    delete generalEvaluationFormToSendBackend.isPhysiotherapyPast;
    delete generalEvaluationFormToSendBackend.isPhysiotherapyPast;
    delete generalEvaluationFormToSendBackend.nameSurname;
  }

}
