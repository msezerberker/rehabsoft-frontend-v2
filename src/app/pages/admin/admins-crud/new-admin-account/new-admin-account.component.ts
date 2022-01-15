import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormComponent, DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { first } from 'rxjs/operators';
import { AdminCrudService } from '../../../../shared/services/admin-crud.service';
import { NewAccountRequest } from 'src/app/models/new-account-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-admin-account',
  templateUrl: './new-admin-account.component.html',
  styleUrls: ['./new-admin-account.component.scss']
})
export class NewAdminAccountComponent implements OnInit {

 
  @ViewChild('dxNewAdminAccountRequestFormComponent') validationFormComponent: DxFormComponent
  @Output() getAllAdmins = new EventEmitter<void>();

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

  submitbuttonOptions: any = { useSubmitBehavior: true, text: 'Yeni Kayıt oluşturun', onClick: (Event) => this.saveAdminAccount(Event), width: '100%', type: "default" };


  constructor(private router: Router, private admincrudService: AdminCrudService) {}

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
    if(this.registerForm.password !== '' && e.value !== ''){
      return this.registerForm.password === e.value;
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
    this.popUpContent = new NewAccountRequest();
    this.popUpTitle = 'Yeni Admin Kaydı';
    this.isVisible = true;
    this.isEditPopUp = false;
  }

  closePopUp = () => {
    this.registerForm = new NewAccountRequest();
    this.popUpContent = new NewAccountRequest();
    this.isVisible = false;
  }


  saveAdminAccount = (e: any) => {

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
            this.getAllAdmins.next();

          }

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          //this.loading = false;
        });
     
  }


}
