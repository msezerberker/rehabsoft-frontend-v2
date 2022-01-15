import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {ResponseVideoRequest} from "../../../../../models/responsevideorequest/responsevideorequest";
import {ResponseVideoRequestService} from "../../../../../shared/services/response-video-request.service";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-view-response-component',
  templateUrl: 'view-response.component.html'
})

export class ViewResponseComponent implements OnInit, OnDestroy{

  stylingMode:string = "filled";
  isVisible: boolean;
  popUpContent:any;
  responseVideoRequest:ResponseVideoRequest;
  requestedVideoListPrepared:{
    id: number;
    videoUrl: string;
    videoFile: File;
    videoRequestUrl:string;
  }[];
  title:any;

  constructor(private responseVideoRequestService: ResponseVideoRequestService ) {
  }

  ngOnInit(): void {
    console.log("VIEW EXERCISE CANLANDI!!");
  }

  openPopUp = (responseVideoRequest: ResponseVideoRequest)=>{
    this.responseVideoRequest = responseVideoRequest;
    this.title = "Hastanın Gönderdiği Videolar";
    this.isVisible = true;

    this.prepareExerciseVideoForRequest(responseVideoRequest);
  }
  prepareExerciseVideoForRequest = (responseVideoRequest: ResponseVideoRequest) => {
    console.log("iteration error:",responseVideoRequest.requestedVideoCollection);
    let exerciseVideoListPrepared:any = [...responseVideoRequest.requestedVideoCollection];

    exerciseVideoListPrepared.forEach(requestedVideo =>{
      let fileType = requestedVideo.videoUrl.split(".").pop();
      requestedVideo["videoRequestUrl"] = `${environment.API_BASE_PATH}/video/stream/requested-video/${fileType}/${requestedVideo.id}`;
    });

    this.requestedVideoListPrepared = exerciseVideoListPrepared;
  }

  //
  // imageFileExtensions = ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi',
  //   'png', 'gif', 'webp', 'tiff','tif','psd','raw','arw','cr2','nrw','k25',
  //   'bmp','dib','heif','heic','ind','indd','indt','jp2','j2k','jpf','jpx','jpm',
  //   'mj2','svg','svgz','ai','eps','pdf'
  // ];
  // videoFileExtensions = ['mpg', 'mp2', 'mpeg', 'mpe', 'mpv',
  //   'ogg', 'mp4', 'm4p', 'm4v',
  //   'avi','wmv','mov', 'qt','flv', 'swf', 'avchd','webm'];

  ngOnDestroy(): void {
    console.log("VIEW RESPONSE DESTROY OLUYOR!!");
  }

  closePopUp() {
    this.isVisible = false;
  }
}
