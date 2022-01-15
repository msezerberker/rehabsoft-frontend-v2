import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {DxFormComponent} from "devextreme-angular";
import {OnlineMeeting} from "../../../models/online-meeting";
import {Patient} from "../../../models/patient";
import {Doctor} from "../../../models/doctor";
import {OnlineMeetingService} from "../../../shared/services/online-meeting.service";
import {PatientService} from "../../../shared/services/patient.service";
import {DoctorService} from "../../../shared/services/doctor.service";

@Component({
  selector: 'app-user-meeting-list',
  templateUrl: './user-meeting-list.component.html'
})
export class UserMeetingListComponent implements OnInit{
  @ViewChild('dxAddMeetingForm') validationFormComponent: DxFormComponent

  dataSource:OnlineMeeting[];
  patient: Patient;
  username: string;
  doctor:Doctor;
  popupVisible: boolean=false;

  constructor(private onlineMeetingsService:OnlineMeetingService, private route: ActivatedRoute, private patientService: PatientService,
              private doctorService:DoctorService) {

    this.username=JSON.parse(localStorage.getItem('currentUser')).username;
  }

  ngOnInit(): void {
    this.getAllMeetings();
  }

  /*********** Service Callers ************/
  getAllMeetings = ()=>{
    this.onlineMeetingsService.getAllByUsername(this.username).subscribe(data=>{
      this.dataSource = data;
    });
  }
}
