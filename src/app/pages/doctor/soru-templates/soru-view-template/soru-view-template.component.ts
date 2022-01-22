import { Component, OnInit } from '@angular/core';
import {TokenDto} from "../../../../models/tokendto";
import {AuthenticationService} from "../../../../security/authentication.service";
import {SoruDynamicService} from "../../../../shared/services/sorudynamic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SoruField} from "../../../../models/dynamicsoru/sorufield";
import {SoruTemplate} from "../../../../models/dynamicsoru/sorutemplate";
import notify from "devextreme/ui/notify";
import {SoruDynamic} from "../../../../models/dynamicsoru/sorudynamic";

@Component({
  selector: 'app-soru-view-template',
  templateUrl: './soru-view-template.component.html',
  styleUrls: ['./soru-view-template.component.scss']
})
export class SoruViewTemplateComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSource: SoruField[];
  answers: any;
  soruTemplate: SoruTemplate;
  id: string;
  private error: any;
  private loading: boolean;

  constructor( private authenticationService:AuthenticationService,private dynamicSoruService: SoruDynamicService,private router: Router,route: ActivatedRoute) {
    this.answers = [];
    this.soruTemplate = new SoruTemplate();
    this.dataSource = [];
    this.soruTemplate.soruDynamic = new SoruDynamic();
    this.soruTemplate.soruDynamic.soruFieldCollection = [];
    const id: string = route.snapshot.params.soruID;
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
    let url =  'doctor/soru-templates';
    this.router.navigateByUrl(url);
  }

  getItem = ()=>{

    this.dynamicSoruService.findTemplateByID(this.id).subscribe(
      (data)=>{
        this.soruTemplate = data;
        this.dataSource = this.soruTemplate.soruDynamic.soruFieldCollection;

        for(let i of this.dataSource){
          if(i.fieldType === 'COKLU_SECMELI'){
            this.answers[i.fieldOrder-1] = [];
          }else{
            this.answers[i.fieldOrder-1] = undefined;
          }
        }
        console.log(this.soruTemplate);
      },
      (error)=>{
        notify(error);
      }
    );
  }

}
