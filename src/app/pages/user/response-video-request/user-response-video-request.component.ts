import {Component, ViewChild} from '@angular/core';
import { VideoRequest } from 'src/app/models/video-request';import
{VideorequestService} from "../../../shared/services/videorequest.service";
import notify from 'devextreme/ui/notify';
import {AuthenticationService} from '../../../security/authentication.service';
import {UserService} from '../../../shared/services/user.service';
import {TokenDto} from '../../../models/tokendto';
import {ResponseVideoRequest} from "../../../models/responsevideorequest/responsevideorequest";
import {ResponseVideoRequestService} from "../../../shared/services/response-video-request.service";
import {DoctorCreateExerciseComponent} from "../../doctor/exerciseManagment/createexercise/doctor-createexercise.component";
import {UserVideoSubmitPopupComponent} from "./user-video-submit-popup/user-video-submit-popup.component";

@Component({
  selector: 'app-user-response-video-request',
  templateUrl: 'user-response-video-request.component.html',
  styleUrls: [ './user-response-video-request.component.scss' ]
})

export class UserResponseVideoRequestComponent {

  username: string;
  currentUser: TokenDto;
  dataSource: VideoRequest[];
  dataSourceResponseVideoRequest: ResponseVideoRequest[];
  allowedPageSizesArray =  [5, 10, 20, 50, 100];
  @ViewChild(UserVideoSubmitPopupComponent) userVideoSubmitPopupComponent:UserVideoSubmitPopupComponent;
  respondingVideoRequestId:number;

  constructor(private videorequestService: VideorequestService, private authenticationService:AuthenticationService,private responseVideoRequestService: ResponseVideoRequestService) {
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getItemsList();
  }

  getItemsList = ()=>{
    this.videorequestService.getAllActive(this.username).subscribe(
      (data)=>{
        this.dataSource = data;
        console.log("data",data);
      },
      (error)=>{
        notify(error);
      }
    );
  }
  openCreateResponsePopUp = (e: any) => {
    console.log("sfasdf");
    this.respondingVideoRequestId = e.row.data.id;
    this.userVideoSubmitPopupComponent.openPopUpForCreate(e.row.data.id);
  }


  // ********** ResponseVideoRequest tab *************///

  getAllResponseVideoRequest = () =>{
    this.responseVideoRequestService.getByVideoRequest(this.respondingVideoRequestId).subscribe(
      (data)=>{
        this.dataSourceResponseVideoRequest = data;
        console.log("dataSourceResponseVideoRequest:",data);
      },
      (error)=>{
        notify(error);
      }
    );
  }

}
