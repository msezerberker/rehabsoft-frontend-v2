import {Component, OnInit} from '@angular/core';
import {FormDynamicService} from '../../../../../shared/services/formdynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../../../../shared/services/patient.service';
import {FormField} from '../../../../../models/dynamicform/formfield';
import {FormFieldDefaultValue} from '../../../../../models/dynamicform/formfielddefaultvalue';
import notify from 'devextreme/ui/notify';
import {AssignedForm} from '../../../../../models/dynamicform/assignedform';
import {first} from 'rxjs/operators';
import {FormDynamic} from '../../../../../models/dynamicform/formdynamic';


@Component({
  selector: 'app-assign-form',
  templateUrl: './assign-form.component.html',
  styleUrls: ['./assign-form.component.scss']
})
export class AssignFormComponent implements OnInit {
  tcKimlikNo:string;
  dataSource: FormField[];
  formFieldDefaultValueMap: any = new Map();
  formFieldSelectBoxElements: string[];
  showDragIcons: boolean;
  formTitle: string;
  formExplanation: string;
  assignForm : AssignedForm;
  private loading: boolean;
  private error: any;
  assignedFormDto:AssignedForm;

  constructor(private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute,private patientService:PatientService) {
    route.parent.params.subscribe(
      (params) => {
        this.tcKimlikNo = params.tckimlikno;

      });
    this.dataSource = [];
    this.showDragIcons = true;
    this.formFieldSelectBoxElements = ['METIN', 'SAYISAL', 'EVET_HAYIR', 'SECMELI', 'COKLU_SECMELI'];
    this.formTitle = '';
    this.formExplanation = '';
    this.formFieldDefaultValueMap = new Map();
    this.assignForm = new AssignedForm();
    this.assignForm.formDynamic = new FormDynamic();


  }

  btnClick =  ()=> {
    if(this.formTitle == "" || this.formTitle == null || this.formExplanation == "" || this.formExplanation == null){
      notify("HATA: Form başlığı ve açıklaması boş bırakılamaz!!!", "error");
      return;
    }

    if(this.dataSource.length == 0){
      notify("HATA: Formu gönderebilmek için en az bir soru eklemelisiniz!!!", "error");
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
          field.formFieldDefaultValueCollection = this.formFieldDefaultValueMap[field.key];
        }
      }
      field.fieldOrder = i;
      i = i + 1;
    }

    this.assignForm.isFormAnswered = false;
    this.assignForm.formDynamic.formFieldCollection = this.dataSource;
    this.assignForm.formDynamic.explanation = this.formExplanation;
    this.assignForm.formDynamic.title = this.formTitle;

    console.log(this.assignForm)

    this.dynamicFormService.assignForm(this.assignForm,this.tcKimlikNo)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          //this.router.onSameUrlNavigation = 'reload';
          let urlArray = this.router.url.split('/');
          urlArray.pop();
          this.router.navigateByUrl(  urlArray.join('/') + '/dynamic-form');

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });

  };

  ngOnInit(): void {
    this.assignedFormDto = {
      creationDate: null,
      formAnswersCollection: [],
      formDynamic : null,
      isFormAnswered: null,
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

  // For example
  //myFunction = (event) => {
    //event.data.fieldType;
  //}


}
