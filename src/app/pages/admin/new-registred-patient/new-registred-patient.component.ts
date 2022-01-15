import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../security/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenDto} from '../../../models/tokendto';
import notify from 'devextreme/ui/notify';
import {PatientService} from '../../../shared/services/patient.service';
import {Patient} from '../../../models/patient';
import {Doctor} from '../../../models/doctor';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-new-registred-patient',
  templateUrl: './new-registred-patient.component.html',
  styleUrls: ['./new-registred-patient.component.scss']
})
export class NewRegistredPatientComponent implements OnInit{

  username: string;
  currentUser: TokenDto;
  patientList: Patient[];
  popupVisible: boolean;
  doctors: Doctor[];
  currentPatientUsername : string;
  private loading: boolean;
  private error: any;

  constructor( private authenticationService:AuthenticationService,private patientService:PatientService,private router: Router,route: ActivatedRoute) {
    this.patientList = [];
    this.popupVisible = false;
    this.doctors = [];
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getNewRegistredPatient();
  }

  getNewRegistredPatient = ()=>{
    this.patientService.getNewRegistredPatient().subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.patientList = data;
        console.log("Yeni kayıt hastalar", this.patientService);
      },
      (error)=>{
        notify(error);
      }
    );
  }

  getAllDoctor = () =>{
    this.patientService.getDoctors().subscribe(
      (data)=>{
        this.doctors = data;
      },
      (error) => {
        notify(error);
      }
    );
  }

  openPopUp = (event) => {
    this.currentPatientUsername = event.row.data.tcKimlikNo;
    this.getAllDoctor();
    this.popupVisible = true;
  }

  assignDoctor =  (event)=> {

    let docUserID = event.row.data.user.id;

    this.patientService.assignDoctorToPatient(  docUserID, this.currentPatientUsername)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));

          this.ngOnInit();
          this.popupVisible = false;
        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });
  };

}
