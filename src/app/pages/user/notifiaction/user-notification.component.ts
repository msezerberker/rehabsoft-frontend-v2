import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../security/authentication.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html'
})
export class UserNotificationComponent {


  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService
              ) {

  }

  ngOnInit() {
    console.log("state management---");

  }

}
