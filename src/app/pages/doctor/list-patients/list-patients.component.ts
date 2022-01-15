import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import notify from 'devextreme/ui/notify';
import { PatientService } from 'src/app/shared/services/patient.service';
import {PatientDetails} from "../../../models/patientdetails"
import {AuthenticationService} from '../../../security/authentication.service';
import {TokenDto} from '../../../models/tokendto';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements OnInit {

  dataSource: PatientDetails[];
  generalEvalFormurl:string;
  username: string;
  currentUser: TokenDto;

  constructor(private authenticationService:AuthenticationService,private patientService:PatientService,private router:Router) {
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
      this.dataSource;
      this.generalEvalFormurl = "../exercises";


  }
  ngOnInit(){
    this.getItemsList();

  }


  getItemsList = ()=>{
    this.patientService.getAllPatientByDoctor(this.username).subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.dataSource = data;
        console.log("Data Source: ", this.dataSource[0].user.email);
      },
      (error)=>{
        notify(error);
      }
    );
  }



  viewButtonClick = (e) =>{
    console.log("butona basildi");
    this.router.navigate(['doctor/patient-info/',e.row.data.tcKimlikNo]);
    //this.generalEvalFormurl = "../exercises";
  }

  okClicked (e) {
    notify("The OK button was clicked")
}

}
