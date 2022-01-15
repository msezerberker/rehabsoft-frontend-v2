import {Component, OnInit, ViewChild} from '@angular/core';
import { VideoRequest } from 'src/app/models/video-request';
import { VideorequestService } from 'src/app/shared/services/videorequest.service';
import notify from "devextreme/ui/notify";
import {first} from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/shared/services/patient.service';
import {PatientDetails} from "../../../../models/patientdetails"
import {ViewExerciseComponent} from "../../../../shared/components/view-exercise/view-exercise.component";
import {ViewResponseComponent} from "./view-response/view-response.component";



@Component({
  selector: 'app-video-request',
  templateUrl: './video-request.component.html',
  styleUrls: ['./video-request.component.scss']
})
export class VideoRequestComponent implements OnInit {

  @ViewChild(ViewResponseComponent) viewResponseComponent:ViewResponseComponent;
  videoRequestDto:VideoRequest;
  loading = false;
  error = '';
  videoRequestList: VideoRequest[];
  tcKimlikNo:string;


  submitbuttonOptions:any = {useSubmitBehavior: false, text: 'Gönder', onClick: ()=>this.sendVideoRequest(),
    width: '130px',type:"default", icon: 'fas fa-check-circle',};

  constructor(private videoRequestService:VideorequestService,private router: Router,route: ActivatedRoute,private patientService:PatientService) {
    route.parent.params.subscribe(
      (params) =>
      {
            this.tcKimlikNo= params.tckimlikno;
       });



   }

  ngOnInit() {
    this.videoRequestDto = {
      requestContent:"",
      requestTitle:"",
      doctor:null,
      patient:null,
      exerciseCollection:null,
      responseVideoRequest:null,
      creationDate:null,
      id: null

  },
  this.getRequestHistory();

  }


  getRequestHistory = ()=>{
    this.videoRequestService.getAll(this.tcKimlikNo).subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.videoRequestList = data;
        console.log("Video listesi ", this.videoRequestList);
      },
      (error)=>{
        notify(error);
      }
    );
  }




  sendVideoRequest= ()=> {

    console.log("sendVideo method in Component");
    console.log("veri:",this.videoRequestDto);
    this.videoRequestService.postVideoRequest(this.videoRequestDto,this.tcKimlikNo)
            .pipe(first())
            .subscribe(
              data => {
                // message is ok
                notify(JSON.stringify(data.responseMessage));
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

}
