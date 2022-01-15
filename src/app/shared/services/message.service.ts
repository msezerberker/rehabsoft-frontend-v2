import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../../models/message';
import { MessageHistory } from '../../models/messagehistory';



@Injectable({ providedIn: 'root' })
export class MessageService{

  constructor(private http: HttpClient) { }


  sendMessage(message:Message){
    console.log("sendmessage method in Service");
    return this.http.post<any>(`${environment.API_BASE_PATH}/message/save`,message);
  }

  getMessageHistory(receiverEmail:string){
    console.log("receive message history method in Service");
    return this.http.get<MessageHistory[]>(`${environment.API_BASE_PATH}/message/history/${receiverEmail}`);

  }

/*
  getAll(tcKimlikNo:string) {
    return this.http.get<VideoRequest[]>(`${environment.API_BASE_PATH}/video-request/history/${tcKimlikNo}`);
  }

  getAllActive(username:string){
    return this.http.get<VideoRequest[]>(`${environment.API_BASE_PATH}/video-request/active-requests/${username}`);
  }
*/
}
