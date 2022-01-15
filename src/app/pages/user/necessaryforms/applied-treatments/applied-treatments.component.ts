import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {AuthenticationService} from '../../../../security/authentication.service';
import {Hyperbilirubinemia} from "../../../../models/generalevaluationform/hyperbilirubinemia";
import {AfterBirthReasonCerebralPalsy} from "../../../../models/generalevaluationform/afterbirthreasoncerebralpalsy";
import {AppliedSurgery} from "../../../../models/generalevaluationform/appliedsurgery";
import {OtherOrthesisInfo} from "../../../../models/generalevaluationform/otherorthesisinfo";
import {UsedMedicine} from "../../../../models/generalevaluationform/usedmedicine";
import {OrthesisInfo} from "../../../../models/generalevaluationform/orthesisinfo";


@Component({
  selector: 'app-applied-treatments',
  templateUrl: './applied-treatments.component.html',
  styleUrls: ['./applied-treatments.component.scss']
})
export class AppliedTreatmentsComponent {

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
  isBotoxTreatmentList = [{name:'Oldu', value: true},{name:'Hiç olmadı', value: false}];
  isBotoxTreatmentOption = {
    dataSource: this.isBotoxTreatmentList,
    layout:"horizontal",
    valueExpr: 'value',
    displayExpr: 'name'
  };

  lastBotoxDateOption = {
    stylingMode: 'outlined',
    showClearButton:"true",
    useMaskBehavior:"true",
    displayFormat:"shortdate",
    onValueChanged:(event)=>{
    }
  }

  // Orthesis checkbox options
  @Input()
  isOrthesisMap:any;
  @Input()
  orthesisMap:any;

  checkIsFalseBothLeftAndRightForValidation = (event)=>{
    // console.log(event.formItem.label.text);
    // console.log((this.orthesisMap.get(event.formItem.label.text).get('left')===true && this.orthesisMap.get(event.formItem.label.text).get('right')==false)
    //   || (!this.orthesisMap.get(event.formItem.label.text).get('left')===false && this.orthesisMap.get(event.formItem.label.text).get('right')==true));
    //
    // return (this.orthesisMap.get(event.formItem.label.text).get('left') && !this.orthesisMap.get(event.formItem.label.text).get('right'))
    //   || (!this.orthesisMap.get(event.formItem.label.text).get('left') && this.orthesisMap.get(event.formItem.label.text).get('right'));
    return true;
  }

  orthesisTabanlikCheckBoxOptions:any;
  leftTabanlikCheckBoxOptions:any;
  rightTabanlikOrthesisCheckBoxOptions:any;
  /////
  orthesisTopukKapiCheckBoxOptions:any;
  leftOrthesisTopukKapiCheckBoxOptions:any;
  rightOrthesisTopukKapiCheckBoxOptions:any;
  /////
  /////
  orthesisAyakBilegiCheckBoxOptions:any;
  leftOrthesisAyakBilegiCheckBoxOptions:any;
  rightOrthesisAyakBilegiCheckBoxOptions:any;/////
  orthesisSabitAyakCheckBoxOptions:any;
  leftOrthesisSabitAyakCheckBoxOptions:any;
  rightOrthesisSabitAyakCheckBoxOptions:any;/////
  orthesisEklemliAyakCheckBoxOptions:any;
  leftOrthesisEklemliAyakCheckBoxOptions:any;
  rightOrthesisEklemliAyakCheckBoxOptions:any;/////
  orthesisDinamikAyakCheckBoxOptions:any;
  leftOrthesisDinamikAyakCheckBoxOptions:any;
  rightOrthesisDinamikAyakCheckBoxOptions:any;/////
  orthesisBacakGeceCheckBoxOptions:any;
  leftOrthesisBacakGeceCheckBoxOptions:any;
  rightOrthesisBacakGeceCheckBoxOptions:any;/////
  orthesisImmobilizerCheckBoxOptions:any;
  leftOrthesisImmobilizerCheckBoxOptions:any;
  rightOrthesisImmobilizerCheckBoxOptions:any;

  orthesisKalcaAteliCheckBoxOptions:any;

  orthesisGovdeKorsesiCheckBoxOptions:any;/////
  orthesisDirsekSiplintiCheckBoxOptions:any;
  leftOrthesisDirsekSiplintiCheckBoxOptions:any;
  rightOrthesisDirsekSiplintiCheckBoxOptions:any;/////
  orthesisBasParmakCheckBoxOptions:any;
  leftOrthesisBasParmakCheckBoxOptions:any;
  rightOrthesisBasParmakCheckBoxOptions:any;


  //--------- variables to add One-to-Many relation objects ----------//
  //*** Applied Surgeries Variables ***//
  @Input()
  appliedSurgeryOptions: any[];
  @Input()
  addAppliedSurgeryButtonOptions: any ;

  //*** Other Orthesis Variables ***//
  @Input()
  otherOrthesisOptions: any[];
  @Input()
  addOtherOrthesisButtonOptions: any;
  //*** Used Medicine Variables ***//
  @Input()
  usedMedicineOptions: any[];
  @Input()
  addUsedMedicineButtonOptions: any;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.orthesisTabanlikCheckBoxOptions = {
      value: this.isOrthesisMap[0].value,
      onValueChanged: (e) => {
        this.isOrthesisMap[0].value = e.component.option("value");
      }
    }
    this.leftTabanlikCheckBoxOptions = {
      value: this.orthesisMap.get('Tabanlık').get('left'),
      onValueChanged: (event)=>{
        this.orthesisMap.set('Tabanlık', this.orthesisMap.get('Tabanlık').set('left',event.value));
      },
      text:"Sol taban"
    }
    this.rightTabanlikOrthesisCheckBoxOptions = {
      value: this.orthesisMap.get('Tabanlık').get('right'),
      onValueChanged: (event)=>{
        this.orthesisMap.set('Tabanlık', this.orthesisMap.get('Tabanlık').set('right',event.value));
      },
      text:"Sağ taban"
    }
    /////
    this.orthesisTopukKapiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[1].value = event.component.option("value");
      }
    }
    this.leftOrthesisTopukKapiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Topuk Kapı', this.orthesisMap.get('Topuk Kapı').set('left',event.value));
      },
      text:"Sol topuk"
    }
    this.rightOrthesisTopukKapiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Topuk Kapı', this.orthesisMap.get('Topuk Kapı').set('right',event.value));
      },
      text:"Sağ topuk"
    }
    /////
    /////
    this.orthesisAyakBilegiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[2].value = event.component.option("value");
      },
      width:22
    }
    this.leftOrthesisAyakBilegiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Ayak bileği hizasında ortez (supra-malleoler)', this.orthesisMap.get('Ayak bileği hizasında ortez (supra-malleoler)').set('left',event.value));
      },
      text:"Sol ayak bileği"
    }
    this.rightOrthesisAyakBilegiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Ayak bileği hizasında ortez (supra-malleoler)', this.orthesisMap.get('Ayak bileği hizasında ortez (supra-malleoler)').set('right',event.value));
      },
      text:"Sağ ayak bileği"
    }/////
    this.orthesisSabitAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[3].value = event.component.option("value");
      }
    }
    this.leftOrthesisSabitAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Sabit Ayak-ayak bileği ortezi (AFO)', this.orthesisMap.get('Sabit Ayak-ayak bileği ortezi (AFO)').set('left',event.value));
      },
      text:"Sol Ayak"
    }
    this.rightOrthesisSabitAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Sabit Ayak-ayak bileği ortezi (AFO)', this.orthesisMap.get('Sabit Ayak-ayak bileği ortezi (AFO)').set('right',event.value));
      },
      text:"Sağ Ayak"
    }/////
    this.orthesisEklemliAyakCheckBoxOptions = {
      onValueChanged: (event)=>{
        this.isOrthesisMap[4].value = event.component.option("value");
      }
    }
    this.leftOrthesisEklemliAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', this.orthesisMap.get('Eklemli Ayak-ayak bileği ortezi (eklemli AFO)').set('left',event.value));
      },
      text:"Sol Ayak"
    }
    this.rightOrthesisEklemliAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Eklemli Ayak-ayak bileği ortezi (eklemli AFO)', this.orthesisMap.get('Eklemli Ayak-ayak bileği ortezi (eklemli AFO)').set('right',event.value));
      },
      text:"Sağ Ayak"
    }/////
    this.orthesisDinamikAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[5].value = event.component.option("value");
      }
    }
    this.leftOrthesisDinamikAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Dinamik ayak ayak bileği ortezi (DAFO)', this.orthesisMap.get('Dinamik ayak ayak bileği ortezi (DAFO)').set('left',event.value));
      },
      text:"Sol Ayak"
    }
    this.rightOrthesisDinamikAyakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Dinamik ayak ayak bileği ortezi (DAFO)', this.orthesisMap.get('Dinamik ayak ayak bileği ortezi (DAFO)').set('right',event.value));
      },
      text:"Sağ Ayak"
    }/////
    this.orthesisBacakGeceCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[6].value = event.component.option("value");
      }
    }
    this.leftOrthesisBacakGeceCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Bacaklar için gece splinti', this.orthesisMap.get('Bacaklar için gece splinti').set('left',event.value));
      },
      text:"Sol Bacak"
    }
    this.rightOrthesisBacakGeceCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Bacaklar için gece splinti', this.orthesisMap.get('Bacaklar için gece splinti').set('right',event.value));
      },
      text:"Sağ Bacak"
    }/////
    this.orthesisImmobilizerCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[7].value = event.component.option("value");
      }
    }
    this.leftOrthesisImmobilizerCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('İmmobilizer', this.orthesisMap.get('İmmobilizer').set('left',event.value));
      },
      text:"Sol Omuz"
    }
    this.rightOrthesisImmobilizerCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('İmmobilizer', this.orthesisMap.get('İmmobilizer').set('right',event.value));
      },
      text:"Sağ Omuz"
    }

    this.orthesisKalcaAteliCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[8].value = event.component.option("value");
      }
    }

    this.orthesisGovdeKorsesiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[9].value = event.component.option("value");
      }
    }
    this.orthesisDirsekSiplintiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[10].value = event.component.option("value");
      }
    }
    this.leftOrthesisDirsekSiplintiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Dirsek splinti', this.orthesisMap.get('Dirsek splinti').set('left',event.value));
      },
      text:"Sağ Dirsek"
    }
    this.rightOrthesisDirsekSiplintiCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Dirsek splinti', this.orthesisMap.get('Dirsek splinti').set('right',event.value));
      },
      text:"Sol Dirsek"
    }/////
    this.orthesisBasParmakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.isOrthesisMap[11].value = event.component.option("value");
      }
    }
    this.leftOrthesisBasParmakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Baş parmak ortezi', this.orthesisMap.get('Baş parmak ortezi').set('left',event.value));
      },
      text:"Sol Parmak"
    }
    this.rightOrthesisBasParmakCheckBoxOptions = {
      value: null,
      onValueChanged: (event)=>{
        this.orthesisMap.set('Baş parmak ortezi', this.orthesisMap.get('Baş parmak ortezi').set('right',event.value));
      },
      text:"Sağ Parmak"
    }
  }

  checkIsNull = (event)=>{
    return event.value !== null;
  }

  //Patient form event handler end


  // image uploader
  uploadBotoxReport = (event) => {
    // console.log("uploadBotoxReport: ", event.value);
    this.generalEvaluationForm.botoxTreatment.botoxRecordFile = event.value[0];
  }
  uploadAppliedSurgeryReport = (event, index) => {
    this.generalEvaluationForm.appliedSurgeryCollection[index].epicrisisImageFile =  event.value[0];
  }
  uploadOtherOrthesisImage = (event, index) => {
    this.generalEvaluationForm.otherOrthesisInfoCollection[index].orthesisImageFile =  event.value[0];
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
    // let generalEvaluationFormToSendBackend = {...this.generalEvaluationForm};
    this.generalEvaluationForm.orthesisInfoCollection = this.generateOrthesisCollection(this.generalEvaluationForm);
    this.nextStepper.emit();
  }

  private generateOrthesisCollection = (generalEvaluationFormToSendBackend:any):OrthesisInfo[] =>{
    let orthesisCollectionForField: OrthesisInfo[] = [];
    generalEvaluationFormToSendBackend.isOrthesisMap.forEach( isOrthesis=>{
      if(isOrthesis.value){
        let orthesisInfo = new OrthesisInfo(this.orthesisMap.get(isOrthesis.name).get("left"),
          this.orthesisMap.get(isOrthesis.name).get("right"), isOrthesis.name);
        orthesisCollectionForField.push(orthesisInfo);
      }
    });
    return orthesisCollectionForField;
  }


}
