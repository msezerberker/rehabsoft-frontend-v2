import {Component, OnInit} from '@angular/core';
import {TokenDto} from '../../models/tokendto';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../security/authentication.service';
import {AppInfoService} from '../../shared/services';
import {Role} from '../../models/role';

@Component({
  templateUrl: 'user.component.html',
  styleUrls: [ './user.component.scss' ]
})

export class UserComponent implements OnInit{
  currentUser: TokenDto;

  isUser = false;
  isNotAuthorized = false;

  // constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService) { }
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public appInfo: AppInfoService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.isNotAuthorized = this.checkisNotAuthorized();
    this.isUser = this.checkisUser();
    console.log(this.isNotAuthorized, this.isUser, this.currentUser);
  }

  checkisNotAuthorized = () => {
    return this.currentUser === null;
  }

  checkisUser = () => {
    if(!(this.currentUser === null)){
      return this.currentUser.role === Role.User
    }
    else return false;
  }
}
