import {Component, OnInit} from '@angular/core';
import {TokenDto} from '../../../../models/tokendto';
import {FormField} from '../../../../models/dynamicform/formfield';
import {AssignedForm} from '../../../../models/dynamicform/assignedform';
import {AuthenticationService} from '../../../../security/authentication.service';
import {FormDynamicService} from '../../../../shared/services/formdynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormDynamic} from '../../../../models/dynamicform/formdynamic';
import notify from 'devextreme/ui/notify';
import {FormTemplate} from '../../../../models/dynamicform/formtemplate';

@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.scss']
})
export class ViewTemplateComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSource: FormField[];
  answers: any;
  formTemplate: FormTemplate;
  id:string;
  private error: any;
  private loading: boolean;

  constructor( private authenticationService:AuthenticationService,private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute) {
    this.answers = [];
    this.formTemplate = new FormTemplate();
    this.dataSource = [];
    this.formTemplate.formDynamic = new FormDynamic();
    this.formTemplate.formDynamic.formFieldCollection = [];
    const id: string = route.snapshot.params.formID;
    this.id = id;

    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getItem();
    this.answers = [];
  }

  btnClick () : void {
    let url =  'doctor/form-templates';
    this.router.navigateByUrl(url);
  }

  getItem = ()=>{

    this.dynamicFormService.findTemplateByID(this.id).subscribe(
      (data)=>{
        this.formTemplate = data;
        this.dataSource = this.formTemplate.formDynamic.formFieldCollection;

        for(let i of this.dataSource){
          if(i.fieldType === 'COKLU_SECMELI'){
            this.answers[i.fieldOrder-1] = [];
          }else{
            this.answers[i.fieldOrder-1] = undefined;
          }
        }
        console.log(this.formTemplate);
      },
      (error)=>{
        notify(error);
      }
    );
  }

}
