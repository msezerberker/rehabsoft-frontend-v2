import {CommonModule} from '@angular/common';
import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {DxFormModule} from 'devextreme-angular/ui/form';
import {DxLoadIndicatorModule} from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../../security/authentication.service';
import {DxButtonModule} from 'devextreme-angular';
import {TokenDto} from '../../../models/tokendto';
import {Role} from '../../../models/role';
import {DxiButtonModule} from "devextreme-angular/ui/nested";
import {FirebaseMessagingService} from "../../services/firebase-messaging.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitbuttonOptions:any = {useSubmitBehavior: true, text: 'Giriş Yap', onClick: (event)=>this.login(event), width: '100%',type:"default"};

  loginForm: {
    username: '',
    password: '',
  };
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  passwordMode = 'password';
  passwordButtonList = [{
    name: "trash",
    location: "after",
    options: {
      stylingMode: "text",
      icon: "fas fa-eye",
      type: "default",
      onClick: () => {
        this.passwordMode = this.passwordMode === "text" ? "password" : "text";
      }
    }
  }];

  currentUser: TokenDto;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private messagingService: FirebaseMessagingService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.loginForm = {
      username: '',
      password: ''
    };

    this.returnUrl = '/';

    if(this.currentUser !== null){
      if(this.currentUser.role === Role.User) {
        this.router.navigate(['/user']);
      }
      if(this.currentUser.role === Role.Doctor) {
        this.router.navigate(['/doctor']);
      }
      if(this.currentUser.role === Role.Admin) {
        this.router.navigate(['/admin']);
      }
    }

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(event) {
    this.submitted = true;

    // stop here if form is invalid
    if (!event.validationGroup.validate().isValid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.username, this.loginForm.password)
      .pipe(first())
      .subscribe(
        data => {
          // buraya ve router'i sil
          this.setFirebaseTokenForUser(data);
          if(data.role === Role.User) {
            this.router.navigate(['/user/home']);
          }
          if(data.role === Role.Doctor) {
            this.router.navigate(['/doctor/home']);
          }
          if(data.role === Role.Admin) {
            this.router.navigate(['/admin']);
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          notify({ message: "Kullanıcı bilgileriniz doğrulanamadı. Lütfen kontrol ederek tekrar deneyiniz", width: 300, shading: false }, "error", 1000);
        });
    // event.preventDefault()
  }

  setFirebaseTokenForUser = (data) =>{
    this.messagingService.requestPermission(data);
    this.messagingService.receiveMessage();
  }

  onCreateAccountClick = () => {
    this.router.navigate(['register']).then(r => {});
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule,
    DxiButtonModule
  ],
  declarations: [ LoginComponent ],
  exports: [ LoginComponent ]
})
export class LoginFormModule { }
