import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user.service';
import { MustMatch } from '../helpers/must-match.validator';
import {UpdatePasswordDto} from 'src/app/models/updatepassword'


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService) { }
  
  isTokenTrue: Boolean = false;
  token: string;
  passwordForm:any;
  updatePasswordDto:UpdatePasswordDto;
  

  loading = false;
  submitted = false;
  error = '';
  submitbuttonOptions: any = { useSubmitBehavior: true, text: 'Onayla', onClick: (Event) => this.updatePassword(Event), width: '100%', type: "default" };


  ngOnInit() {
    this.token = this.route.snapshot.params.token
    this.resetPassword(this.token);


    this.passwordForm = {
      password: '',
      confirmPassword: '',
      confirmedPassword: ''
    };

    this.updatePasswordDto = {
      password: '',
      token: ''
    };



  }


  

  get f() {
    return this.passwordForm.controls;
  }



  confirmPassword = (e: { value: string }) => {
    if(this.passwordForm.password !== '' && e.value !== ''){
      return this.passwordForm.password === e.value;
    } 
    return true;
  }




  updatePassword(e:any) {
       // stop here if form is invalid
       if (!e.validationGroup.validate().isValid) {
        //this.loading = true;
        return;
      }

    this.submitted = true;
    this.loading = true;

    this.updatePasswordDto.password = this.passwordForm.confirmedPassword.trim();
    this.updatePasswordDto.token = this.token;

    this.userService.updatePassword(this.updatePasswordDto).subscribe(
      (data) => {
        if (data.responseType === 1) {
          notify(data.responseMessage);
          this.router.navigate(['/login']);
        }
        else {
          notify(data.responseMessage);
        }
      },
      (error) => {
        notify(error);
      }
    );



  }



//this.router.navigate(['/login']);


  resetPassword(token: string) {

    this.userService.resetPassword(token).subscribe(
      (data) => {
        if (data.responseType === 1) {
          this.isTokenTrue = true;
        }
        else {
          notify(data.responseMessage);
        }
      },
      (error) => {
        notify(error);
      }
    );

  }


}
