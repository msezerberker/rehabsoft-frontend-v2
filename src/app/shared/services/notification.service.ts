import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Notification } from 'src/app/models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private http: HttpClient) {

  }

  getAll() {
    return this.http.get<Notification[]>(`${environment.API_BASE_PATH}/notification/all`);
  }

  clickNotification(id:number) {
    return this.http.get<any>(`${environment.API_BASE_PATH}/notification/click/${id}`);
  }




}
