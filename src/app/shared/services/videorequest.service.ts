import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {VideoRequest} from "../../models/video-request"




@Injectable({ providedIn: 'root' })
export class VideorequestService{

  constructor(private http: HttpClient) { }

  //432815522 nolu tc'yi dene

  postVideoRequest(videoRequest: VideoRequest,tcKimlikNo:string){
    console.log("postVideo method in Service");
    return this.http.post<any>(`${environment.API_BASE_PATH}/video-request/create/${tcKimlikNo}`,videoRequest);
  }

  getAll(tcKimlikNo:string) {
    return this.http.get<VideoRequest[]>(`${environment.API_BASE_PATH}/video-request/history/${tcKimlikNo}`);
  }

  getAllActive(username:string){
    return this.http.get<VideoRequest[]>(`${environment.API_BASE_PATH}/video-request/active-requests/${username}`);
  }

}
