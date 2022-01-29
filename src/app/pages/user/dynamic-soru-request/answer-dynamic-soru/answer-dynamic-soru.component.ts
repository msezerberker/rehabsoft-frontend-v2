import { Component, OnInit } from '@angular/core';
import {TokenDto} from '../../../../models/tokendto';
import {AuthenticationService} from '../../../../security/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import {SoruField} from '../../../../models/dynamicsoru/sorufield';
import {AssignedSoru} from '../../../../models/dynamicsoru/assignedsoru';
import {SoruDynamicService} from "../../../../shared/services/sorudynamic.service";
import {SoruDynamic} from "../../../../models/dynamicsoru/sorudynamic";
import {SoruAnswer} from "../../../../models/dynamicsoru/soruanswer";

@Component({
  selector: 'app-answer-dynamic-soru',
  templateUrl: './answer-dynamic-soru.component.html',
  styleUrls: ['./answer-dynamic-soru.component.scss']
})
export class AnswerDynamicSoruComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSource: SoruField[];
  answers: any;
  assignedSoru: AssignedSoru;
  id: string;
  defValueMap: any  ;
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
    this.defValueMap = [];

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
    const answersList = [];
    for ( const field  of  this.dataSource) {
      let answ ;
      answ = new SoruAnswer();
      answ.soruField = new SoruField();
      if ( field.fieldType == 'COKLU_SECMELI'){
        let answ2;
        for (const item of this.answers[field.fieldOrder - 1]){
          answ2 = new SoruAnswer();
          answ2.soruField = new SoruField();
          answ2.answer = item;
          answ2.soruField = field;
          answersList.push(answ2);
        }
      }else{
        answ.answer = this.answers[field.fieldOrder - 1];
        answ.soruField = field;
        answersList.push(answ);
      }
    }

    this.assignedSoru.soruAnswersCollection = answersList;
    this.dynamicSoruService.answerTheSoru(this.assignedSoru, this.id)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          // this.router.onSameUrlNavigation = 'reload';
          const url =  'user/dynamic-soru-request'   ;
          this.router.navigateByUrl(url);
        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });
  }

  getItem = () => {
    this.dynamicSoruService.findAssignSoruById(this.id).subscribe(
      (data) => {
        this.assignedSoru = data;
        this.dataSource = this.assignedSoru.soruDynamic.soruFieldCollection;
        const map = [];
        this.dataSource.forEach(function(field){
          if (field.fieldType == 'SECMELI' || field.fieldType == 'COKLU_SECMELI' ){
            let list: string[];
            list = [];
            let i = 0;
            field.soruFieldDefaultValueCollection.forEach(function(field){
              list[i] = field.valueName;
              i++;
            });
            map[field.id] = list;
          }
        });
        this.defValueMap = map;
      },
      (error) => {
        notify(error);
      }
    );
  }

}
