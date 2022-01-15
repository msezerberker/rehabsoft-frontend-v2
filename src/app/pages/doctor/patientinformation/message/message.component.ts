import { Message } from 'src/app/models/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';
import { ViewResponseComponent } from '../video-request/view-response/view-response.component';
import notify from "devextreme/ui/notify";
import {first} from "rxjs/operators";
import { PatientService } from 'src/app/shared/services/patient.service';

import { MessageHistory } from 'src/app/models/messagehistory';
import { UserService } from 'src/app/shared/services/user.service';





@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  submitbuttonOptions:any = {useSubmitBehavior: false, text: 'Gönder', onClick: ()=>this.sendMessage(),
    width: '130px',type:"default", icon: 'fas fa-check-circle',};

    messageDto:Message;
    loading = false;
    error = '';
    tcKimlikNo:string;
    currentUserEmail:string;
    currentUserUsername:string;
    @ViewChild(ViewResponseComponent) viewResponseComponent:ViewResponseComponent;


messageHistoryList:MessageHistory[];


    constructor(private messageService: MessageService, private userService: UserService,private patientService:PatientService,private router: Router,route: ActivatedRoute) {
      route.parent.params.subscribe(
        (params) =>
        {
              this.tcKimlikNo= params.tckimlikno;
         });



     }

  ngOnInit() {
    this.messageDto = {
      messageContent:"",
      messageTitle:"",
      receiverEmail:""
  },

  this.currentUserUsername=JSON.parse(localStorage.getItem('currentUser')).username;
  this.getcurrentUserDetails(this.currentUserUsername);

  this.getReceiverEmail();




  }



  sendMessage= ()=> {

    console.log("senMessage method in Component");
    this.messageService.sendMessage(this.messageDto)
            .pipe(first())
            .subscribe(
              data => {
                // message is ok
                //this.router.onSameUrlNavigation = 'reload';
                this.ngOnInit();

              },
              error => {
                notify(JSON.stringify(error.responseMessage));
                this.error = error;
                this.loading = false;
              });

  }

  getReceiverEmail = ()=>{
    this.patientService.getPatientByTcKimlikNo(this.tcKimlikNo).subscribe(
      (data)=>{
        this.messageDto.receiverEmail = data.user.email;

        this.getMessageHistory( data.user.email);


      },
      (error)=>{
        notify("Bir hata meydana geldi.");
      }
    );
  }





  isResponseNotNull = (event)=>{
    console.log("response: ",event.row.data);
    return event.row.data.responseVideoRequest !== null;
  }

  // to view response
  openPopUp = (e)=>{
    this.viewResponseComponent.openPopUp(e.row.data.responseVideoRequest);
  }






  getMessageHistory = (oppositeSide:string)=>{
    this.messageService.getMessageHistory(oppositeSide).subscribe(
      (data)=>{
        this.messageHistoryList = data;
        console.log("Mesaj geçmişi: ", this.messageHistoryList);
      },
      (error)=>{
        notify(error);
      }
    );
  }


isMyMessage(msg:MessageHistory): boolean {
  return msg.senderEmail === this.currentUserEmail;
}

getcurrentUserDetails = (username:string)=>  { this.userService.getByUsername(username).subscribe(
  (data)=>{
    this.currentUserEmail= data.email;
  },
  (error)=>{
    notify(error);
  }
);

}




}
