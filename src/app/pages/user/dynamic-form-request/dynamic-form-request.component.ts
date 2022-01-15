import {Component, OnInit} from '@angular/core';
import {VideorequestService} from '../../../shared/services/videorequest.service';
import {AuthenticationService} from '../../../security/authentication.service';
import {TokenDto} from '../../../models/tokendto';
import {AssignedForm} from '../../../models/dynamicform/assignedform';
import {FormDynamicService} from '../../../shared/services/formdynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import {FormField} from '../../../models/dynamicform/formfield';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-form-request',
  templateUrl: './dynamic-form-request.component.html',
  styleUrls: ['./dynamic-form-request.component.scss']
})
export class DynamicFormRequestComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSourceActive: AssignedForm[];
  dataSourceHistory: AssignedForm[];
  id: number;
  dynamicFormsUrl: string;

  constructor( private authenticationService:AuthenticationService,private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute) {
    this.id = null;
    this.dynamicFormsUrl = 'answer-dynamic-form';
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getItemsActiveList();
    this.getItemsHistoryList();
  }

  getItemsActiveList = ()=>{
    this.dynamicFormService.getAllAssignedNotAnswered(this.username).subscribe(
      (data)=>{
        this.dataSourceActive = data;
        console.log("data",data);
      },
      (error)=>{
        notify(error);
      }
    );
  }

  getItemsHistoryList = ()=>{
    this.dynamicFormService.getAllAssignedAnswered(this.username).subscribe(
      (data)=>{
        this.dataSourceHistory = data;
        console.log("data",data);
      },
      (error)=>{
        notify(error);
      }
    );
  }

  answerForm = (event) =>{
    this.id = event.row.data.id;
    let url =  'user/answer-dynamic-form' + '/' + this.id   ;
    this.router.navigateByUrl(url);
  }

  viewForm = (event) =>{
    this.id = event.row.data.id;
    let url = 'user/view-dynamic-form' + '/' + this.id   ;
    this.router.navigateByUrl(url);
  }

}
