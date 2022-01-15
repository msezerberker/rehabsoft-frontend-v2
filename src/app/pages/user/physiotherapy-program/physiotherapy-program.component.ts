import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import {ViewExerciseProgramsComponent} from "../../../shared/components/view-exercise-program/view-exercise-programs.component";
import {PhysiotherapyProgram} from "../../../models/exerciseprogram/physiotherapy-program";
import {TokenDto} from "../../../models/tokendto";
import {PhysiotherapyProgramService} from "../../../shared/services/physiotherapy-program.service";
import {PatientService} from "../../../shared/services/patient.service";
import {AuthenticationService} from "../../../security/authentication.service";

@Component({
  selector: 'app-physiotherapy-program-component',
  templateUrl: './physiotherapy-program.component.html',
  styleUrls: ['./physiotherapy-program.component.scss'],


})
export class PhysiotherapyProgramComponent implements OnInit {
  @ViewChild("ViewExerciseProgramsComponent") viewExerciseProgramsComponent:ViewExerciseProgramsComponent;

  loading = false;
  error = '';
  assignedprogramList: PhysiotherapyProgram[];
  tcKimlikNo:string;
  username: string;
  currentUser: TokenDto;


  constructor(private exerciseProgramService:PhysiotherapyProgramService, private router: Router, route: ActivatedRoute, private patientService:PatientService, private authenticationService:AuthenticationService) {
    this.assignedprogramList = [];

    this.tcKimlikNo= JSON.parse(localStorage.getItem('currentUser')).username;
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
      patientService.getPatient(this.username).subscribe(data=>{
        this.tcKimlikNo = data.tcKimlikNo;
      });
    });
  }

  ngOnInit(): void {
    this.getAllAssignedExercises();
  }

  getAllAssignedExercises = ()=>{
    this.exerciseProgramService.getAllAssigned(this.tcKimlikNo).subscribe(
      (data)=>{
        this.assignedprogramList = data;
      },
      (error)=>{
        notify(error);
      }
    );
  }

  previewIconClick=(e)=>{
    this.viewExerciseProgramsComponent.openPopUpForView(e.row.data, true);
  }
}
