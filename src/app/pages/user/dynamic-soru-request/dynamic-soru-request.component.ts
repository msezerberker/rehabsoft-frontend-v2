import { Component, OnInit } from '@angular/core';
import {TokenDto} from "../../../models/tokendto";
import {AuthenticationService} from "../../../security/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import notify from "devextreme/ui/notify";
import {AssignedSoru} from "../../../models/dynamicsoru/assignedsoru";
import {SoruDynamicService} from "../../../shared/services/sorudynamic.service";

@Component({
  selector: 'app-dynamic-soru-request',
  templateUrl: './dynamic-soru-request.component.html',
  styleUrls: ['./dynamic-soru-request.component.scss']
})
export class DynamicSoruRequestComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  dataSourceActive: AssignedSoru[];
  dataSourceHistory: AssignedSoru[];
  id: number;
  dynamicSoruUrl: string;

  constructor( private authenticationService:AuthenticationService,private dynamicSoruService: SoruDynamicService,private router: Router,route: ActivatedRoute) {
    this.id = null;
    this.dynamicSoruUrl = 'answer-dynamic-soru';
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
    this.dynamicSoruService.getAllAssignedNotAnswered(this.username).subscribe(
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
    this.dynamicSoruService.getAllAssignedAnswered(this.username).subscribe(
      (data)=>{
        this.dataSourceHistory = data;
        console.log("data",data);
      },
      (error)=>{
        notify(error);
      }
    );
  }

  answerSoru = (event) =>{
    this.id = event.row.data.id;
    let url =  'user/answer-dynamic-soru' + '/' + this.id   ;
    this.router.navigateByUrl(url);
  }

  viewSoru = (event) =>{
    this.id = event.row.data.id;
    let url = 'user/view-dynamic-soru' + '/' + this.id   ;
    this.router.navigateByUrl(url);
  }

}
