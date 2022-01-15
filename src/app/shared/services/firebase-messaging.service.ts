import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../security/authentication.service";
import {User} from "../../models/user";
@Injectable()
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {
  }
  requestPermission(data:User) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        console.log("token",token);
        this.saveTokenForUser(token, currentUser.username).subscribe(data=>{
        });
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("----------------new message received-------------------.", payload);
        this.currentMessage.next(payload);
      })
  }

  saveTokenForUser = (token:string, username:string) => {
    console.log("token. ", token);
    console.log("username. ", username);
    return this.http.post<any>(`${environment.API_BASE_PATH}/firebase-messaging/save-token/${username}`,token);
  }
}
