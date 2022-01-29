import { Component, OnInit } from '@angular/core';
import {TokenDto} from '../../../../models/tokendto';
import {AuthenticationService} from '../../../../security/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import {SoruField} from '../../../../models/dynamicsoru/sorufield';
import {AssignedSoru} from '../../../../models/dynamicsoru/assignedsoru';
import {SoruDynamicService} from '../../../../shared/services/sorudynamic.service';
import {SoruDynamic} from '../../../../models/dynamicsoru/sorudynamic';

@Component({
  selector: 'app-view-dynamic-soru',
  templateUrl: './view-dynamic-soru.component.html',
  styleUrls: ['./view-dynamic-soru.component.scss']
})
export class ViewDynamicSoruComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSource: SoruField[];
  answers: any;
  assignedSoru: AssignedSoru;
  id: string;
  private error: any;
  private loading: boolean;

  constructor( private authenticationService: AuthenticationService, private dynamicSoruService: SoruDynamicService, private router: Router, route: ActivatedRoute) {
    this.answers = [];
    this.assignedSoru = new AssignedSoru();
    this.dataSource = [];
    this.assignedSoru.soruDynamic = new SoruDynamic();
    this.assignedSoru.soruDynamic.soruFieldCollection = [];
    const id: string = route.snapshot.params.soruID;
    this.id = id;

    authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getItem();
    this.answers = [];
  }

  btnClick(): void {
    const url =  'user/dynamic-soru-request'   ;
    this.router.navigateByUrl(url);
  }

  getItem = () => {

    this.dynamicSoruService.findAssignSoruById(this.id).subscribe(
      (data) => {
        this.assignedSoru = data;
        this.dataSource = this.assignedSoru.soruDynamic.soruFieldCollection;
        const list = [];
        for (const item of this.assignedSoru.soruAnswersCollection){
          if ( item.soruField.fieldType === 'COKLU_SECMELI'){
            this.answers[item.soruField.fieldOrder - 1] = [];
            list.push(item);
          }else{
            this.answers[item.soruField.fieldOrder - 1] = item.answer;
          }
        }
        for (const item of list){
          this.answers[item.soruField.fieldOrder - 1].push(item.answer);
        }

      },
      (error) => {
        notify(error);
      }
    );
  }

}
