import {Component, OnInit} from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import {Router} from '@angular/router';

import {AuthenticationService} from './security/authentication.service';
import {Role} from './models/role';
import {TokenDto} from './models/tokendto';
import {AppInfoService} from './shared/services';
import {UserService} from './shared/services/user.service';

import { locale, loadMessages } from "devextreme/localization";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  currentUser: TokenDto;

  // constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService) { }
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public appInfo: AppInfoService
  ) { }

  ngOnInit(): void {  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  isAuthorized(){
    return this.authenticationService.currentUserValue !== null;
  }

  getTitleByRole(){
    if(this.authenticationService.currentUserValue.role === Role.User){
      return this.appInfo.title+'-'+'Hasta';
    }
    if(this.authenticationService.currentUserValue.role === Role.Doctor){
      return this.appInfo.title+'-'+'Fizyoterapist';
    }
    if(this.authenticationService.currentUserValue.role === Role.Admin){
      return this.appInfo.title+'-'+'Admin';
    }
  }
}
