import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { first } from 'rxjs/operators';
import { DoctorInfo } from 'src/app/models/doctor-info';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/shared/services/message.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { ViewResponseComponent } from '../../doctor/patientinformation/video-request/view-response/view-response.component';

import { MessageHistory } from 'src/app/models/messagehistory';
import { UserService } from 'src/app/shared/services/user.service';




@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class PatientMessageComponent implements OnInit {

  doctorInfo:DoctorInfo;

  colCountByScreen: object;
  submitbuttonOptions:any = {useSubmitBehavior: false, text: 'Gönder', onClick: ()=>this.sendMessage(),
  width: '130px',type:"default", icon: 'fas fa-check-circle',};

  messageHistoryList:MessageHistory[];
  username:string;
  currentUserEmail:string;
  doctorEmail:string;

  isDoctorAssignedToPatient:boolean=true;


  messageDto:Message;
  loading = false;
  error = '';
  @ViewChild(ViewResponseComponent) viewResponseComponent:ViewResponseComponent;


  constructor(private patientService:PatientService,private messageService: MessageService,private router: Router,route: ActivatedRoute,private userService: UserService) {

    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    };


  }

  ngOnInit() {
    this.messageDto = {
      messageContent:"",
      messageTitle:"",
      receiverEmail:""
    },
    this.doctorInfo={
      email:"",
      name:"",
      surname:""
    },
    this.getDoctorInfo();
    this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    this.getcurrentUserDetails(this.username);

  }



  getDoctorInfo = ()=>  { this.patientService.getDoctorInfo().subscribe(
    (data)=>{
      console.log("doktor data",data);
      if(data==null){
        console.log("doktor atamasi yapilmamis");
        this.isDoctorAssignedToPatient=false;
      }
      else{
        this.doctorInfo = {
          name:data.name,
          surname: data.surname,
          email: data.email,
        }
        this.doctorEmail=data.email;
        this.messageDto.receiverEmail=data.email;

        this.getMessageHistory(this.doctorInfo.email);
        console.log(data);
      }
    },
    (error)=>{
      notify("Mesajlaşma özelliğini kullanmak için Fizyoterapist ataması gerçekleştirilmelidir.");
    }
  );

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




isResponseNotNull = (event)=>{
console.log("response: ",event.row.data);
return event.row.data.responseVideoRequest !== null;
}

// to view response
openPopUp = (e)=>{
this.viewResponseComponent.openPopUp(e.row.data.responseVideoRequest);
}




getMessageHistory = (email:string)=>{
  this.messageService.getMessageHistory(email).subscribe(
    (data)=>{
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
    this.currentUserEmail= data.email;
  },
  (error)=>{
    notify(error);
  }
);

}


isMyMessage(msg:MessageHistory): boolean {
  return msg.senderEmail === this.currentUserEmail;
}


isAssigned():boolean{
  return this.isDoctorAssignedToPatient;
}

}
