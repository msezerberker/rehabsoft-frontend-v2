import { Component, NgModule, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import notify from 'devextreme/ui/notify';

import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import {AuthenticationService} from '../../../security/authentication.service';
import {TokenDto} from '../../../models/tokendto';
import {Role} from '../../../models/role';
import {Router} from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title: string;

  currentUser:TokenDto=new TokenDto();

  backClick() {
    this._location.back();

  }

  userMenuItems = [{
    text: 'Profil',
    icon: 'user'

  }, {
    text: 'Logout',
    icon: 'runner',
    onClick: () => {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
  }];

  constructor(private authenticationService: AuthenticationService,
              private router: Router,private _location: Location) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    // this.authenticationService.currentUserValue().then((e) => this.user = e.data);
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule
  ],
  declarations: [ HeaderComponent ],
  exports: [ HeaderComponent ]
})
export class HeaderModule { }
