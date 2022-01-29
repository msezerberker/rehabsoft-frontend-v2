import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientService} from "../../../../../shared/services/patient.service";
import notify from "devextreme/ui/notify";
import {first} from "rxjs/operators";
import {FormFieldDefaultValue} from "../../../../../models/dynamicform/formfielddefaultvalue";
import {SoruField} from "../../../../../models/dynamicsoru/sorufield";
import {AssignedSoru} from "../../../../../models/dynamicsoru/assignedsoru";
import {SoruDynamicService} from "../../../../../shared/services/sorudynamic.service";
import {SoruDynamic} from "../../../../../models/dynamicsoru/sorudynamic";

@Component({
  selector: 'app-assign-soru',
  templateUrl: './assign-soru.component.html',
  styleUrls: ['./assign-soru.component.scss']
})
export class AssignSoruComponent implements OnInit {

  tcKimlikNo: string;
  dataSource: SoruField[];
  formFieldDefaultValueMap: any = new Map();
  soruFieldSelectBoxElements: string[];
  showDragIcons: boolean;
  soruTitle: string;
  soruExplanation: string;
  assignSoru: AssignedSoru;
  private loading: boolean;
  private error: any;
  assignedSoruDto: AssignedSoru;

  constructor(private dynamicSoruService: SoruDynamicService, private router: Router,route: ActivatedRoute,private patientService:PatientService) {
    route.parent.params.subscribe(
      (params) => {
        this.tcKimlikNo = params.tckimlikno;

      });
    this.dataSource = [];
    this.showDragIcons = true;
    this.soruFieldSelectBoxElements = ['METIN', 'SAYISAL', 'EVET_HAYIR', 'SECMELI', 'COKLU_SECMELI'];
    this.soruTitle = '';
    this.soruExplanation = '';
    this.formFieldDefaultValueMap = new Map();
    this.assignSoru = new AssignedSoru();
    this.assignSoru.soruDynamic = new SoruDynamic();


  }

  btnClick =  ()=> {
    if(this.soruTitle == "" || this.soruTitle == null || this.soruExplanation == "" || this.soruExplanation == null){
      notify("HATA: Soru başlığı ve açıklaması boş bırakılamaz!!!", "error");
      return;
    }

    if(this.dataSource.length == 0){
      notify("HATA: Soru gönderebilmek için en az bir soru eklemelisiniz!!!", "error");
      return;
    }

    let i = 1;
    for(let field of this.dataSource){
      if(field.fieldType == 'SECMELI' || field.fieldType == 'COKLU_SECMELI'){
        if(this.formFieldDefaultValueMap[field.key].length < 1 || this.formFieldDefaultValueMap[field.key] === undefined){
          notify("HATA: SECMELI ve COKLU_SECMELI soru tiplerinin şıkları boş bırakılamaz!!!", "error");
          return;
        }
        else{
          field.soruFieldDefaultValueCollection = this.formFieldDefaultValueMap[field.key];
        }
      }
      field.fieldOrder = i;
      i = i + 1;
    }

    this.assignSoru.isSoruAnswered = false;
    this.assignSoru.soruDynamic.soruFieldCollection = this.dataSource;
    this.assignSoru.soruDynamic.explanation = this.soruExplanation;
    this.assignSoru.soruDynamic.title = this.soruTitle;

    console.log(this.assignSoru);

    this.dynamicSoruService.assignSoru(this.assignSoru, this.tcKimlikNo)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          //this.router.onSameUrlNavigation = 'reload';
          let urlArray = this.router.url.split('/');
          urlArray.pop();
          this.router.navigateByUrl(  urlArray.join('/') + '/dynamic-soru');

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });

  };

  ngOnInit(): void {
    this.assignedSoruDto = {
      creationDate: null,
      soruAnswersCollection: [],
      soruDynamic : null,
      isSoruAnswered: null,
      patient: null,
      id: null
    }
  }

  isEnabled(event ): boolean {
    var result;
    this.dataSource.forEach(function(field){
      if(field.key == event){
        result = field.fieldType;
      }
    });
    return result == 'SECMELI' || result == 'COKLU_SECMELI';
  }


  onReorder = (e) => {
    var visibleRows = e.component.getVisibleRows(),
      toIndex = this.dataSource.indexOf(visibleRows[e.toIndex].data),
      fromIndex = this.dataSource.indexOf(e.itemData);

    this.dataSource.splice(fromIndex, 1);
    this.dataSource.splice(toIndex, 0, e.itemData);
  }

  onInitNewRow = (event) =>{
    event.data.key = new Date().valueOf().toString();
    this.formFieldDefaultValueMap[event.data.key] = Array<FormFieldDefaultValue>();
  }

  submit = () =>{
    delete this.dataSource[0].key;
  }

}
