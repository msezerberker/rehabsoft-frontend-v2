import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResponseVideoRequest} from "../../models/responsevideorequest/responsevideorequest";
import {ExerciseVideo} from "../../models/exercise/exercisevideo";
import {RequestedVideo} from "../../models/responsevideorequest/requestedvideo";

@Injectable({ providedIn: 'root' })
export class ResponseVideoRequestService{

  constructor(private http: HttpClient) { }


  getBy(id:number){
    return this.http.get<ResponseVideoRequest[]>(`${environment.API_BASE_PATH}/response-video-request/get/${id}`);
  }

  getAll(){
    return this.http.get<ResponseVideoRequest[]>(`${environment.API_BASE_PATH}/response-video-request/all/`);
  }

  getByVideoRequest(videoRequestId: number) {
    return this.http.get<ResponseVideoRequest[]>(`${environment.API_BASE_PATH}/response-video-request/get-by-video-request/${videoRequestId}`);
  }

  postResponseVideoRequest(responseVideoRequest: ResponseVideoRequest,videoRequestId:number){
    console.log("postVideo method in Service");
    const payload = new FormData();
    this.appendRequestedVideosToResponseVideoRequest(responseVideoRequest.requestedVideoCollection, payload);
    payload.append('model', JSON.stringify(responseVideoRequest));
    return this.http.post<any>(`${environment.API_BASE_PATH}/response-video-request/create/${videoRequestId}`,payload);
  }
  private appendRequestedVideosToResponseVideoRequest = (requestedVideos: RequestedVideo[], payload: FormData) =>{
    if(requestedVideos !== null ){
      if(requestedVideos.length>0){
        requestedVideos.forEach((requestedVideo,index)=>{
          if( !this.checkIsEmpty(requestedVideo.videoFile) ){
            console.log("eklemeden once video: ", requestedVideo.videoFile);
            payload.append('responseMediaList', requestedVideo.videoFile);
            console.log("eklendikten sonra payload: ", payload);
            requestedVideo.videoUrl = requestedVideo.videoFile.name.split('.')[0];
          }
          delete requestedVideo.videoFile;
        });
      }
    }
  }
  private checkIsEmpty = (object: any) =>{
    if(object === undefined ){
      return true;
    }
    return object === null;
  }
}
