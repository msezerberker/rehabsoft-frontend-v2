import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormComponent, DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../security/authentication.service';
import { AdminCrudService } from '../../../shared/services/admin-crud.service';
import { NewAccountRequest } from 'src/app/models/new-account-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
export class NewAccountComponent implements OnInit {


  @ViewChild('dxNewAccountRequestFormComponent') validationFormComponent: DxFormComponent
  @Output() getAllDoctors = new EventEmitter<void>();
  @Output() getAllAdmins = new EventEmitter<void>();

  accountType: number; // 0=Doctor 1=Admin ....Burada belirtilene göre save operasyonu yapılıyor.

  registrationRequest: NewAccountRequest;
  registerForm;
  loading = false;
  submitted = false;
  error = '';

  isEditPopUp: boolean = false;
  isVisible: boolean;
  popUpContent: any;
  isLoading: boolean;

  popUpTitle: string = '';

  submitbuttonOptions: any = { useSubmitBehavior: true, text: 'Yeni Kayıt oluşturun', onClick: (Event) => this.saveAccount(Event), width: '100%', type: "default" };


  constructor(private router: Router, private admincrudService: AdminCrudService) {


  }

  ngOnInit() {

    this.registerForm = {
      username: '',
      password: '',
      firstName: '',
      surname: '',
      email: '',
      confirmPassword: '',
      confirmedPassword: ''
    };

    this.registrationRequest = {
      username: '',
      password: '',
      firstName: '',
      surname: '',
      email: ''
    };

  }

  confirmPassword = (e: { value: string }) => {
    if (this.registerForm.password !== '' && this.registerForm.confirmedPassword !== '') {
      console.log(this.registerForm.password);
      console.log(this.registerForm.confirmedPassword);
      return this.registerForm.password === this.registerForm.confirmedPassword;
    }
    return true;
  }



  cancelExercise = (Event) => {
    this.closePopUp();
  }


  cancelButtonOption = {
    text: 'Vazgeç',
    onClick: (e) => this.cancelExercise(e),
    width: '130px',
    type: 'outlined',
  }


  openPopUpForCreate = () => {
    console.log("Popup açılmaya basladi");
    this.popUpTitle = 'Yeni Kayıt';
    this.isVisible = true;
    this.isEditPopUp = false;
  }

  closePopUp = () => {
    
    console.log("Popup kapama basladi");
    this.popUpContent = new NewAccountRequest();
    this.isVisible = false;
  }


  saveAccount = (e: any) => {
    console.log("Gelen Bilgi1" + this.registerForm.username);
    console.log(this.registerForm);

    //this.isLoading = true
    this.registrationRequest.username = this.registerForm.username.trim();
    this.registrationRequest.password = this.registerForm.password.trim();
    this.registrationRequest.email = this.registerForm.email.trim();
    this.registrationRequest.firstName = this.registerForm.firstName.trim();
    this.registrationRequest.surname = this.registerForm.surname.trim();


    // stop here if form is invalid
    if (!e.validationGroup.validate().isValid) {
      //this.loading = true;
      return;
    }

    this.submitted = true;
    //this.loading = true;




    if (this.accountType === 0) { //if it is for doctor

      this.admincrudService.saveDoctorAccount(this.registerForm)
        .pipe(first())
        .subscribe(
          data => {
            notify(JSON.stringify(data.responseMessage));

            if (data.responseType === 0) {//if there is a problem but it isn't users fault
              //this.loading = false;

            }

            else {
              this.closePopUp();
             
            }

          },
          error => {
            notify(JSON.stringify(error.responseMessage));
            this.error = error;
            //this.loading = false;
          });





    }
    else if (this.accountType === 1) {
      this.admincrudService.saveAdminAccount(this.registerForm)
      .pipe(first())
      .subscribe(
        data => {
          notify(JSON.stringify(data.responseMessage));

          if (data.responseType === 0) {//if there is a problem but it isn't users fault
            this.loading = false;
          }

          else {
            this.closePopUp();
          
            
          }

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          //this.loading = false;
        });

    }
    else {
      notify("Hatali islem");
      return;
    }

  }





  saveDoctor = (e: any) => {






    ///notify({ message: error, width: 300, shading: false }, "error", 1500);
  }


}
