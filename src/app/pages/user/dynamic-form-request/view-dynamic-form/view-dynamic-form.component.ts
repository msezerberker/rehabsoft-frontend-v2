import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenDto} from '../../../../models/tokendto';
import {AuthenticationService} from '../../../../security/authentication.service';
import {FormDynamicService} from '../../../../shared/services/formdynamic.service';
import {FormField} from '../../../../models/dynamicform/formfield';
import notify from 'devextreme/ui/notify';
import {AssignedForm} from '../../../../models/dynamicform/assignedform';
import {FormDynamic} from '../../../../models/dynamicform/formdynamic';

@Component({
  selector: 'app-view-dynamic-form',
  templateUrl: './view-dynamic-form.component.html',
  styleUrls: ['./view-dynamic-form.component.scss']
})
export class ViewDynamicFormComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSource: FormField[];
  answers: any;
  assignedForm: AssignedForm;
  id:string;
  private error: any;
  private loading: boolean;

  constructor( private authenticationService:AuthenticationService,private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute) {
    this.answers = [];
    this.assignedForm = new AssignedForm();
    this.dataSource = [];
    this.assignedForm.formDynamic = new FormDynamic();
    this.assignedForm.formDynamic.formFieldCollection = [];
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
    let url =  'user/dynamic-form-request'   ;
    this.router.navigateByUrl(url);
  }

  getItem = ()=>{

    this.dynamicFormService.findAssignFormById(this.id).subscribe(
      (data)=>{
        this.assignedForm = data;
        this.dataSource = this.assignedForm.formDynamic.formFieldCollection;
        let list = [];
        for(let item of this.assignedForm.formAnswersCollection){
          if( item.formField.fieldType === "COKLU_SECMELI"){
            this.answers[item.formField.fieldOrder-1] = [];
            list.push(item);
          }else{
            this.answers[item.formField.fieldOrder-1] = item.answer;
          }
        }
        for(let item of list){
          this.answers[item.formField.fieldOrder-1].push(item.answer);
        }

      },
      (error)=>{
        notify(error);
      }
    );
  }

}
