import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import notify from "devextreme/ui/notify";
import {DxDateBoxComponent} from "devextreme-angular";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {PhysiotherapyProgram} from "../../../models/exerciseprogram/physiotherapy-program";
import {ScheduledExercise} from "../../../models/exerciseprogram/scheduledexercise";
import {ScheduledExerciseDateMap} from "../../../pages/doctor/patientinformation/exercise-programs/create-exercise-program/model/scheduled-exercise-date-map";
import {PhysiotherapyProgramService} from "../../services/physiotherapy-program.service";
import {PatientService} from "../../services/patient.service";
import {AuthenticationService} from "../../../security/authentication.service";
import {DoctorService} from "../../services/doctor.service";

@Component({
  selector: 'app-view-exercise-programs-component',
  templateUrl: './view-exercise-programs.component.html',
  styleUrls: ['./view-exercise-programs.component.scss'],
})
export class ViewExerciseProgramsComponent implements OnInit {

  width:string='85%';
  @ViewChild("viewExerciseListComponent") viewExerciseListComponent;
  cancelButtonOption = {
    text: 'Vazgeç',
    onClick: (e)=>{
      this.closePopUp();
    },
    width: '130px',
    type: 'outlined',
  }
  now:Date=new Date();
  tomorrow:Date=new Date(this.now);
  @Output() getAllProgram = new EventEmitter<void>();
  isVisible: boolean=false;
  popUpContent:PhysiotherapyProgram;
  isPatient:boolean=false;

  startDate:Date;
  endDate:Date;

  scheduledExerciseList: ScheduledExercise[]=[];
  resourcesData: Resource[];
  scheduledExerciseDateMap:ScheduledExerciseDateMap;
  selectedDate;
  goal:string;

  constructor(private physiotherapyProgramService:PhysiotherapyProgramService, private route: ActivatedRoute,
              private patientService:PatientService, private authenticationService:AuthenticationService, private doctorService:DoctorService) {

  }

  ngOnInit(): void {

  }

  cancelOnAppointmentFormOpening = e => {
    e.cancel = true;
  }

  openPopUpForView = (phiysiotherapyProgram:PhysiotherapyProgram, isPatient:boolean)=>{
    this.isVisible = true;
    console.log("phiysiotherapyProgram:",phiysiotherapyProgram);
    this.goal = phiysiotherapyProgram.goal;

    this.scheduledExerciseDateMap = new ScheduledExerciseDateMap();
    this.popUpContent = phiysiotherapyProgram;
    this.resourcesData = resources;
    this.now =new Date();
    this.tomorrow =new Date(this.now);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.isPatient = isPatient;
    this.convertScheduledExerciseListToScheduledExerciseDateMap(phiysiotherapyProgram.scheduledExerciseCollection);
    this.startDate = new Date(Date.parse(phiysiotherapyProgram.startDate));
    this.endDate = new Date(Date.parse(phiysiotherapyProgram.finishDate));
    if(this.isPatient){
    }
    this.scheduledExerciseList = this.convertScheduledExerciseDateMapToScheduledExerciseListForSchedule(this.scheduledExerciseDateMap);
  }

  private convertScheduledExerciseListToScheduledExerciseDateMap = (scheduledExerciseList:ScheduledExercise[])=>{
    this.scheduledExerciseDateMap = new ScheduledExerciseDateMap();
    scheduledExerciseList.forEach(scheduledExercise=>{
      if(this.scheduledExerciseDateMap[scheduledExercise.scheduledDate] === undefined){
        this.scheduledExerciseDateMap[scheduledExercise.scheduledDate] = [];
      }
      this.scheduledExerciseDateMap[scheduledExercise.scheduledDate].push(scheduledExercise);
    });
    console.log("this.scheduledExerciseDateMap",this.scheduledExerciseDateMap);

  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

  onExerciseProgramFormOpening = (e: any) => {
    if(!this.isPatient){
      return;
    }
    if(!this.isDateOutOfRange(e.cellData.startDate, this.startDate, this.endDate)){
      if(this.scheduledExerciseDateMap !== undefined) {
        // to make same with coming from backend dates
        this.selectedDate = new Date(e.cellData.startDate);
        this.selectedDate.setDate( e.cellData.startDate.getDate()+1 );
        this.selectedDate.setHours(0);
        console.log("selectedDate.toISOString()",this.selectedDate.toISOString().slice(0,-5));
        console.log("this.scheduledExerciseDateMap",this.scheduledExerciseDateMap);
        this.viewExerciseListComponent.openPopUpForView(this.scheduledExerciseDateMap[this.selectedDate.toISOString().slice(0,-5)]);
      } else{
        this.notifyEmptyDate();
      }
    } else{
      this.notifyDisableDate();
    }
  }

  notifyDisableDate() {
    notify("Seçtiğiniz başlangıç ve bitiş aralığı dışında.", "warning", 2000);
  }

  notifyEmptyDate() {
    notify("Seçtiğiniz gün için bir egzersiz bulunmamaktadır.", "warning", 2000);
  }

  isDateOutOfRange = (date: Date, startDate: Date, endDate: Date) => {
    if(startDate !== undefined || endDate !== undefined){
      startDate.setHours(0);
      endDate.setHours(0);
      return date<this.startDate || date>this.endDate ;
    } return false;
  }

  submitScheduledExercisesClicked = ()=>{
    this.physiotherapyProgramService.getById(this.popUpContent.id).subscribe(data=>{
      this.popUpContent = data;
      this.convertScheduledExerciseListToScheduledExerciseDateMap(this.popUpContent.scheduledExerciseCollection);
      this.scheduledExerciseList = this.convertScheduledExerciseDateMapToScheduledExerciseListForSchedule(this.scheduledExerciseDateMap);
    });
  }
  convertScheduledExerciseDateMapToScheduledExerciseListForSchedule = (scheduledExerciseDateMap: ScheduledExerciseDateMap):ScheduledExercise[] =>{
    let scheduledExerciseList = [];
    for (const date in scheduledExerciseDateMap) {
      scheduledExerciseList.push.apply(scheduledExerciseList, scheduledExerciseDateMap[date].map(scheduledExercise=>{
        let obj={...scheduledExercise};
        obj["exerciseName"] = obj.exercise.exerciseName;
        obj["startDate"]=new Date(Date.parse(obj.scheduledDate.replace(' ','T')));
        obj["endDate"]=new Date(Date.parse(obj.scheduledDate.replace(' ','T')));
        return obj;
      }));
    }

    return scheduledExerciseList
  }

}
export class Resource {
  text: string;
  id: boolean;
  color: string;
}
let resources: Resource[] = [
  {
    text: "Room 401",
    id: true,
    color: "#519500"
  }, {
    text: "Room 402",
    id: false,
    color: "#ff0000"
  }
];

