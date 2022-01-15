import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { first } from 'rxjs/operators';
import { MessageHistory } from 'src/app/models/messagehistory';
import { UserService } from '../../services/user.service';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageHistoryList:MessageHistory[];
  username:string;
  email:string;


  constructor(private messageService:MessageService,private router: Router,route: ActivatedRoute,private userService: UserService) { }

  ngOnInit() {
    this.getMessageHistory();
    this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    //console.log("isim:" + this.username);
    this.getcurrentUserDetails(this.username);
  }




  getMessageHistory = ()=>{
    this.messageService.getMessageHistory("oktay@oktay.com").subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.messageHistoryList = data;
        console.log("Mesaj geçmişi: ", this.messageHistoryList);
      },
      (error)=>{
        notify(error);
      }
    );
  }


  getcurrentUserDetails = (username:string)=>  { this.userService.getByUsername(username).subscribe(
    (data)=>{
      this.email= data.email;
    },
    (error)=>{
      notify(error);
    }
  );

}


  isMyMessage(msg:MessageHistory): boolean {
    console.log("Mesaj kontrolü: ", this.messageHistoryList);
    return msg.senderEmail === this.email;
  }



}
