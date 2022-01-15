import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import {User} from "../../../models/user"
import notify from "devextreme/ui/notify";
import { ChangePasswordDto } from 'src/app/models/changePasswordDto';

@Component({
  templateUrl: 'doctor-profile.component.html',
  styleUrls: [ './doctor-profile.component.scss' ]
})

export class DoctorProfileComponent {
  userDetails:any;
  colCountByScreen: object;
  username:any;
  userDto:User;

  passwordForm: any;
  changePasswordDto: ChangePasswordDto;

  loading = false;
  submitted = false;
  error = '';
  submitbuttonOptions: any = { useSubmitBehavior: true, text: 'Onayla', onClick: (Event) => this.changePassword(Event), width: '50%', type: "default" };


  ngOnInit() {

    
    this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    //console.log("isim:" + this.username);
    this.getcurrentUserDetails(this.username);


    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      confirmedPassword: ''
    };

    this.changePasswordDto = {
      username: '',
      oldPassword: '',
      newPassword: '',

    };



  }


  constructor(private userService: UserService) { 
    
    //this.username = localStorage.getItem('username');
    
    this.userDetails = {   
      firstName:"",
      lastName: '',
      email: ''
            /* tslint:disable-next-line:max-line-length */
   
    };
    
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    };
  }



    getcurrentUserDetails = (username:string)=>  { this.userService.getByUsername(username).subscribe(
      (data)=>{
        this.userDetails = {   
          FirstName:data.firstName,
          LastName: data.surname,
          Email: data.email,
        };
        console.log(data);
        this.userDto = data;
      },
      (error)=>{
        notify(error);
      }
    );

  }


  updateUserDetails=() =>{
    this.userDto.firstName= this.userDetails.FirstName;
    this.userDto.surname = this.userDetails.LastName;
    this.userDto.email = this.userDetails.Email;
    console.log(this.userDto);
    this.userService.updateUser(this.userDto).subscribe(data => notify(JSON.stringify(data.responseMessage)));
  }

  





  confirmPassword = (e: { value: string }) => {
    if (this.passwordForm.newPassword !== '' && e.value !== '') {
      return this.passwordForm.newPassword === e.value;
    }
    return true;
  }

  changePassword(e: any) {
    // stop here if form is invalid
    if (!e.validationGroup.validate().isValid) {
      //this.loading = true;
      return;
    }

    this.submitted = true;

    this.changePasswordDto.username = this.username;
    this.changePasswordDto.oldPassword = this.passwordForm.oldPassword.trim();
    this.changePasswordDto.newPassword = this.passwordForm.confirmedPassword.trim();

    console.log("password change cagiriris:" + this.changePasswordDto.username);

    this.userService.changePassword(this.changePasswordDto).subscribe(
      (data) => {
        notify(data.responseMessage);
        
      },
      (error) => {
        notify(error);
      }
    );



  }


}
