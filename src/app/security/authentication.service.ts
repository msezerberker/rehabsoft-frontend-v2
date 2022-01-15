import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user';
import { TokenDto } from '../models/tokendto';
import {CookieService} from "ngx-cookie-service";
import {Token} from "@angular/compiler";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<TokenDto>;
    public currentUser: Observable<TokenDto>;

    constructor(private http: HttpClient, private cookieService:CookieService) {
        this.currentUserSubject = new BehaviorSubject<TokenDto>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): TokenDto {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
      };

      return this.http.post<any>(environment.API_BASE_PATH + '/token', { username, password },httpOptions)

            .pipe(map(user => {

                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    register(registerData) {
      return this.http.post<any>(environment.API_BASE_PATH + '/token/register', registerData)
        .pipe(map(resp => {
          return resp;
        }));
    }



    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    getToken(){

    }
}
