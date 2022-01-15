import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {User} from "../../../models/user";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {OnlineMeetingService} from "../../services/online-meeting.service";
import {OnlineMeeting} from "../../../models/online-meeting";

@Component({
  selector: 'app-online-meeting-block',
  templateUrl: 'online-meeting-block.component.html',
  styleUrls: [ './online-meeting-block.scss' ]
})
export class OnlineMeetingBlockComponent {

  day;
  month;
  year;
  hour;
  _meetingDate;
  isCallDisabled:boolean=true;
  isTooltipShowed:boolean=false;

  @Input()
  with:User;

  @Input()
  meeting:OnlineMeeting;

  @Input()
  set meetingDate(meetingDate:any){
    let now = new Date();
    this._meetingDate=meetingDate;
    let aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    console.log("meetingDate: ",meetingDate);
    meetingDate = meetingDate.replace(' ','T');
    let dateValue=new Date(meetingDate);
    this.day = dateValue.getDate();
    this.month = aylar[dateValue.getMonth()];
    this.year = dateValue.getFullYear();
    this.hour = dateValue.getHours()+":"+dateValue.getMinutes();
    if(this.day === now.getDate()){
      this.isCallDisabled=false;
    }
  }

  @Output()
  delClick = new EventEmitter<OnlineMeeting>();

  @Input()
  isDoctor:boolean=true;

  constructor(private router: Router) {

  }

  delIconClick = (event)=>{
    this.delClick.next(this.meeting);
  }

  callButtonClicked = (event)=>{
    this.router.navigate(['/online-meeting/join']);
  }

  toggleDefault=()=>{
    if(this.isCallDisabled){
      this.isTooltipShowed=!this.isTooltipShowed;
    }
  }
}

