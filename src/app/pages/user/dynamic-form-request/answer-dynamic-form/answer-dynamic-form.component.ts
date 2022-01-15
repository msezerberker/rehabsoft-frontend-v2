import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenDto} from '../../../../models/tokendto';
import {AuthenticationService} from '../../../../security/authentication.service';
import {FormDynamicService} from '../../../../shared/services/formdynamic.service';
import {FormField} from '../../../../models/dynamicform/formfield';
import notify from 'devextreme/ui/notify';
import {AssignedForm} from '../../../../models/dynamicform/assignedform';
import {FormDynamic} from '../../../../models/dynamicform/formdynamic';
import {first} from 'rxjs/operators';
import {FormAnswer} from '../../../../models/dynamicform/formanswer';

@Component({
  selector: 'app-answer-dynamic-form',
  templateUrl: './answer-dynamic-form.component.html',
  styleUrls: ['./answer-dynamic-form.component.scss']
})
export class AnswerDynamicFormComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSource: FormField[];
  answers: any;
  assignedForm: AssignedForm;
  id:string;
  defValueMap : any  ;
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
    this.defValueMap = [];

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
    let answersList = [];
    for( let field  of  this.dataSource) {
      let answ ;
      answ = new FormAnswer();
      answ.formField = new FormField();
      if( field.fieldType == "COKLU_SECMELI"){
        let answ2;
        for(let item of this.answers[field.fieldOrder-1]){
          answ2 = new FormAnswer();
          answ2.formField = new FormField();
          answ2.answer = item;
          answ2.formField = field;
          answersList.push(answ2);
        }
      }else{
        answ.answer = this.answers[field.fieldOrder-1];
        answ.formField = field;
        answersList.push(answ);
      }
    }

    this.assignedForm.formAnswersCollection = answersList;
    this.dynamicFormService.answerTheForm(this.assignedForm,this.id)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          //this.router.onSameUrlNavigation = 'reload';
          let url =  'user/dynamic-form-request'   ;
          this.router.navigateByUrl(url);
        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });
  }

  getItem = ()=>{
    this.dynamicFormService.findAssignFormById(this.id).subscribe(
      (data)=>{
        this.assignedForm = data;
        this.dataSource = this.assignedForm.formDynamic.formFieldCollection;
        let map = [];
        this.dataSource.forEach(function(field){
          if(field.fieldType == "SECMELI" || field.fieldType == "COKLU_SECMELI" ){
            let list : string[];
            list = [];
            let i = 0;
            field.formFieldDefaultValueCollection.forEach(function(field){
              list[i] = field.valueName;
              i++;
            });
            map[field.id] = list;
          }
        });
        this.defValueMap = map;
      },
      (error)=>{
        notify(error);
      }
    );
  }

}
