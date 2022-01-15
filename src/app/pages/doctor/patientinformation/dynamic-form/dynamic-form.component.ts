import {Component, OnInit} from '@angular/core';
import {AssignedForm} from '../../../../models/dynamicform/assignedform';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../../../shared/services/patient.service';
import {FormDynamicService} from '../../../../shared/services/formdynamic.service';
import notify from 'devextreme/ui/notify';
import {FormTemplate} from '../../../../models/dynamicform/formtemplate';
import {AuthenticationService} from '../../../../security/authentication.service';
import {TokenDto} from '../../../../models/tokendto';
import {first} from 'rxjs/operators';


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  loading = false;
  error = '';
  assignedFormList: AssignedForm[];
  tcKimlikNo:string;
  assignFormUrl: string;
  popupVisible: boolean;
  formTemplateList: FormTemplate[];
  username: string;
  currentUser: TokenDto;

  constructor(private dynamicFormService:FormDynamicService,private router: Router,route: ActivatedRoute,private patientService:PatientService, private authenticationService:AuthenticationService) {
    this.popupVisible = false;
    this.formTemplateList = [];
    route.parent.params.subscribe(
      (params) =>
      {
        this.tcKimlikNo= params.tckimlikno;
        this.assignFormUrl = "assign-form";
      });
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }


  btnClick= function ( ) {
    let urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(  urlArray.join('/') + '/assign-form');
  };

  ngOnInit(): void {
      this.getAllAssignedForm();
  }

  getAllAssignedForm = ()=>{
    this.dynamicFormService.getAllAssigned(this.tcKimlikNo).subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.assignedFormList = data;
        console.log("Hastaya atanan formlar-anketler ", this.dynamicFormService);
      },
      (error)=>{
        notify(error);
      }
    );
  }

  isAnswered = (event) =>{
    if(event.row.data.isFormAnswered){
      return "Cevaplandı";
    }else{
      return "Cevap Bekliyor..."
    }
  }

  viewForm = (event) =>{
    let urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(  urlArray.join('/') + '/view-form/' + event.row.data.id );

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

  openPopUp(): void {
    this.getAllTemplates();
    this.popupVisible = true;
  }

  assignTemplate = (event) =>{
    this.dynamicFormService.assignFormFromTemplate(this.tcKimlikNo,event.row.data.id)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          this.popupVisible = false;
          this.ngOnInit();
        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });
  }


}
