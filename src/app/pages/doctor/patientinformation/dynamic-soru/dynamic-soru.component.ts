import { Component, OnInit } from '@angular/core';
import {TokenDto} from '../../../../models/tokendto';
import {SoruDynamicService} from '../../../../shared/services/sorudynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../../../shared/services/patient.service';
import {AuthenticationService} from '../../../../security/authentication.service';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {AssignedSoru} from '../../../../models/dynamicsoru/assignedsoru';
import {SoruTemplate} from '../../../../models/dynamicsoru/sorutemplate';

@Component({
  selector: 'app-dynamic-soru',
  templateUrl: './dynamic-soru.component.html',
  styleUrls: ['./dynamic-soru.component.scss']
})
export class DynamicSoruComponent implements OnInit {

  loading = false;
  error = '';
  assignedSoruList: AssignedSoru[];
  tcKimlikNo: string;
  assignSoruUrl: string;
  popupVisible: boolean;
  soruTemplateList: SoruTemplate[];
  username: string;
  currentUser: TokenDto;

  constructor(private dynamicSoruService: SoruDynamicService, private router: Router, route: ActivatedRoute, private patientService: PatientService, private authenticationService: AuthenticationService) {
    this.popupVisible = false;
    this.soruTemplateList = [];
    route.parent.params.subscribe(
      (params) =>
      {
        this.tcKimlikNo = params.tckimlikno;
        this.assignSoruUrl = 'assign-soru';
      });
    authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }


  btnClick = function() {
    const urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(  urlArray.join('/') + '/assign-soru');
  };

  ngOnInit(): void {
    this.getAllAssignedSoru();
  }

  getAllAssignedSoru = () => {
    this.dynamicSoruService.getAllAssigned(this.tcKimlikNo).subscribe(
      (data) => {
        // console.log("Service data:", data);
        this.assignedSoruList = data;
        console.log('Hastaya atanan soru-cevaplar ', this.dynamicSoruService);
      },
      (error) => {
        notify(error);
      }
    );
  }

  isAnswered = (event) => {
    if (event.row.data.isSoruAnswered){
      return 'Cevaplandı';
    }else{
      return 'Cevap Bekliyor...';
    }
  }

  viewSoru = (event) => {
    const urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(  urlArray.join('/') + '/view-soru/' + event.row.data.id );

  }

  getAllTemplates = () => {
    this.dynamicSoruService.getAllTemplates(this.username).subscribe(
      (data) => {
        // console.log("Service data:", data);
        this.soruTemplateList = data;
        console.log('Hastaya atanan soru-cevaplar ', this.dynamicSoruService);
      },
      (error) => {
        notify(error);
      }
    );
  }

  openPopUp(): void {
    this.getAllTemplates();
    this.popupVisible = true;
  }

  assignTemplate = (event) => {
    this.dynamicSoruService.assignSoruSoruTemplate(this.tcKimlikNo, event.row.data.id)
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
