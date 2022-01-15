import {Component, OnInit} from '@angular/core';
import {FormField} from '../../../../models/dynamicform/formfield';
import {AssignedForm} from '../../../../models/dynamicform/assignedform';
import {FormDynamicService} from '../../../../shared/services/formdynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../../../shared/services/patient.service';
import {FormDynamic} from '../../../../models/dynamicform/formdynamic';
import {AuthenticationService} from '../../../../security/authentication.service';
import {TokenDto} from '../../../../models/tokendto';
import {FormFieldDefaultValue} from '../../../../models/dynamicform/formfielddefaultvalue';
import {FormTemplate} from '../../../../models/dynamicform/formtemplate';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit{

  dataSource: FormField[];
  formFieldDefaultValueMap: any = new Map();
  formFieldSelectBoxElements: string[];
  showDragIcons: boolean;
  formTitle: string;
  formExplanation: string;
  formTemplate : FormTemplate;
  private loading: boolean;
  private error: any;
  username: string;
  currentUser: TokenDto;

  constructor(private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute,private patientService:PatientService, private authenticationService:AuthenticationService) {

    this.dataSource = [];
    this.showDragIcons = true;
    this.formFieldSelectBoxElements = ['METIN', 'SAYISAL', 'EVET_HAYIR', 'SECMELI', 'COKLU_SECMELI'];
    this.formTitle = '';
    this.formExplanation = '';
    this.formFieldDefaultValueMap = new Map();
    this.formTemplate = new FormTemplate();
    this.formTemplate.formDynamic = new FormDynamic();

    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
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

    this.formTemplate.formDynamic.formFieldCollection = this.dataSource;
    this.formTemplate.formDynamic.explanation = this.formExplanation;
    this.formTemplate.formDynamic.title = this.formTitle;


    console.log(this.formTemplate)

    this.dynamicFormService.addTemplate(this.formTemplate,this.currentUser.username)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          //this.router.onSameUrlNavigation = 'reload';
          let urlArray = this.router.url.split('/');
          urlArray.pop();
          this.router.navigateByUrl(  urlArray.join('/') + '/form-templates');

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });

  };

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
