import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../security/authentication.service';
import {FormDynamicService} from '../../../shared/services/formdynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenDto} from '../../../models/tokendto';
import notify from 'devextreme/ui/notify';
import {FormTemplate} from '../../../models/dynamicform/formtemplate';

@Component({
  selector: 'app-form-templates',
  templateUrl: './form-templates.component.html',
  styleUrls: ['./form-templates.component.scss']
})
export class FormTemplatesComponent implements OnInit{

  username: string;
  currentUser: TokenDto;
  formTemplateList: FormTemplate[];

  constructor( private authenticationService:AuthenticationService,private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute) {
    this.formTemplateList = [];
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getAllTemplates();
  }

  getAllTemplates = ()=>{
    this.dynamicFormService.getAllTemplates(this.username).subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.formTemplateList = data;
        console.log("Hastaya atanan formlar-anketler ", this.dynamicFormService);
      },
      (error)=>{
        notify(error);
      }
    );
  }

  btnClick = function() {
    let urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(  urlArray.join('/') + '/create-template');
  };

  viewForm = (event) =>{
    let urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(  urlArray.join('/') + '/view-template/' + event.row.data.id);
  }

}
