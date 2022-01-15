import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {OnlineMeeting} from "../../models/online-meeting";
import {Exercise} from "../../models/exercise/exercise";


@Injectable({ providedIn: 'root' })
export class OnlineMeetingService {

  constructor(private http: HttpClient) {

  }

  getAllByUsername(username:string) {
    return this.http.get<OnlineMeeting[]>(`${environment.API_BASE_PATH}/online-meeting/getOnlineMeetingsByUsername/${username}`);
  }

  save(onlineMeeting:OnlineMeeting){
    return this.http.post<any>(`${environment.API_BASE_PATH}/online-meeting/save`,onlineMeeting);
  }

  deleteById(id:number){
    return this.http.get<any>(`${environment.API_BASE_PATH}/online-meeting/delete/${id}`);
  }

}
