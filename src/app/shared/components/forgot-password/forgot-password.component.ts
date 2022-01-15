import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import {ResetPasswordRequest} from 'src/app/models/resetpasswordrequest'
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  resetrequestform:ResetPasswordRequest;


  loading = false;
  submitted = false;
  error = '';
  submitbuttonOptions: any = { useSubmitBehavior: true, text: 'Gönder', onClick: (Event) => this.sendRequest(Event), width: '100%', type: "default" };


  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit() {

    this.resetrequestform = {
      email: ''    };

  }


  sendRequest(e:any){
    console.log("email",this.resetrequestform);


    this.submitted = true;
   // this.loading = true;

    this.userService.forgotPassworRequest(this.resetrequestform).subscribe(
      (data) => {
        if (data.responseType === 1) {
          notify(data.responseMessage);
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
