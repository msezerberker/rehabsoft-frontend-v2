import { CommonModule } from '@angular/common';
import {Component, NgModule, ViewChild} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../../security/authentication.service';


@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent {
  registerForm: any;
  loading = false;
  submitted = false;
  error = '';

  submitbuttonOptions:any = {useSubmitBehavior: true, text: 'Yeni kayıt oluşturun', onClick: (Event)=>this.register(Event), width: '100%',type:"default"};


  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.registerForm = {
      username: '',
      tcKimlikNo: '',
      password:  '',
      firstName: '',
      surname:  '',
      email: '',
      confirmedPassword: ''
    };
  }

  ngOnInit() {

    this.authenticationService.logout();
  }

  register(event) {

    this.registerForm.username.trim();
    this.registerForm.firstName.trim();
    this.registerForm.surname.trim();
    this.registerForm.email.trim();
    // stop here if form is invalid
    if (!event.validationGroup.validate().isValid) {
      return;
    }

    this.submitted = true;

    this.loading = true;
    this.authenticationService.register(this.registerForm)
      .pipe(first())
      .subscribe(
        data => {
          notify(JSON.stringify(data.responseMessage));
          if(data.responseType===0){//if there is a problem but it isn't users fault
            this.loading=false;
          }
          else{
            this.router.navigate(['/login']);
          }
        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });
  }

  confirmPassword = (e: { value: string }) => {
    if(this.registerForm.password !== '' && e.value !== ''){
      return this.registerForm.password === e.value;
    } 
    return true;
  }

}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ CreateAccountFormComponent ],
  exports: [ CreateAccountFormComponent ]
})
export class CreateAccountFormModule { }
