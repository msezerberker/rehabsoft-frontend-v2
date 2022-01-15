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
  selector: 'app-new-doctor-account',
  templateUrl: './new-doctor-account.component.html',
  styleUrls: ['./new-doctor-account.component.scss']
})
export class NewDoctorAccountComponent implements OnInit {

  @ViewChild('dxNewDoctorAccountRequestFormComponent') validationFormComponent: DxFormComponent
  @Output() getAllDoctors = new EventEmitter<void>();

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

  submitbuttonOptions: any = { useSubmitBehavior: true, text: 'Yeni Doktor Kaydı Oluşturun', onClick: (Event) => this.saveDoctorAccount(Event), width: '100%', type: "default" };


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
    this.popUpTitle = 'Yeni Doktor Kaydı';
    this.isVisible = true;
    this.isEditPopUp = false;
  }

  closePopUp = () => {
    this.registerForm = new NewAccountRequest();
    this.popUpContent = new NewAccountRequest();
    this.isVisible = false;
  }


  saveDoctorAccount = (e: any) => {
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

    this.admincrudService.saveDoctorAccount(this.registerForm)
      .pipe(first())
      .subscribe(
        data => {
          notify(JSON.stringify(data.responseMessage));

          if (data.responseType === 0) {//if there is a problem but it isn't users fault
            this.loading = false;
          }

          else {
            this.closePopUp();
            this.getAllDoctors.next();
          }

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          //this.loading = false;
        });

  }




}
