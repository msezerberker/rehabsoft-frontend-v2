import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {PhysiotherapyProgramService} from "../../../../../shared/services/physiotherapy-program.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PatientService} from "../../../../../shared/services/patient.service";
import {AuthenticationService} from "../../../../../security/authentication.service";
import {Exercise} from "../../../../../models/exercise/exercise";
import {PhysiotherapyProgram} from "../../../../../models/exerciseprogram/physiotherapy-program";
import notify from "devextreme/ui/notify";
import {DxDateBoxComponent} from "devextreme-angular";
import {ScheduledExercise} from "../../../../../models/exerciseprogram/scheduledexercise";
import {ScheduledExerciseDateMap} from "./model/scheduled-exercise-date-map";
import {DoctorService} from "../../../../../shared/services/doctor.service";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-create-exercise-program-component',
  templateUrl: './create-exercise-program.component.html',
  styleUrls: ['./create-exercise-program.component.scss'],


})
export class CreateExerciseProgramComponent implements OnInit {
  @ViewChild("startDateBox") startDateBox;
  @ViewChild("endDateBox") endDateBox
  @ViewChild("exerciseFormModalComponent") exerciseFormModalComponent;

  now:Date=new Date();
  tomorrow:Date=new Date(this.now);
  @Output() getAllProgram = new EventEmitter<void>();
  isLoading: boolean;
  isVisible: boolean;
  popUpContent:PhysiotherapyProgram;
  isEditPopUp:boolean=false;

  startDateBoxValidationMessage:string;
  endDateBoxValidationMessage:string;

  backToDatePickingButtonOption = {
    text: 'Geri',
    onClick: (e)=> {
      this.stepperActiveBooleans['isDatePicking']=true;
      this.stepperActiveBooleans['isProgramCreationPicking']=false;
      this.stepperActiveBooleans['isGoal']=false;
    },
    width: '130px',
    icon:'fas fa-arrow-circle-left',
  }
  nextToScheduleButtonOption = {
    text: 'İleri',
    onClick: (e)=> {
      if(this.programStartDate !== undefined && this.programEndDate !== undefined ){
        if(this.programEndDate <= this.programStartDate ){
          this.startDateBox.validationStatus="invalid";
          this.startDateBox.validationMessageMode="always"
          this.startDateBoxValidationMessage="Başlangıç tarihi, bitiş tarihinden büyük/eşit olamaz";
        } else{
          this.stepperActiveBooleans['isDatePicking']=false;
          this.stepperActiveBooleans['isProgramCreationPicking']=true;
        }

      }
      if(this.programStartDate === undefined){
        this.startDateBox.validationStatus="invalid";
        this.startDateBox.validationMessageMode="always"
        this.startDateBoxValidationMessage="Bu alan gerekli";
      }
      if(this.programEndDate === undefined){
        this.endDateBox.validationStatus="invalid";
        this.endDateBox.validationMessageMode="always"
        this.endDateBoxValidationMessage="Bu alan gerekli";
      }
    },

    width: '130px',
    type: 'default',
    icon:'fas fa-arrow-circle-right',
  }
  backToScheduleButtonOption = {
    text: 'Geri',
    onClick: (e)=> {
      this.stepperActiveBooleans['isDatePicking']=false;
      this.stepperActiveBooleans['isProgramCreationPicking']=true;
      this.stepperActiveBooleans['isGoal']=false;
    },
    width: '130px',
    icon:'fas fa-arrow-circle-left',
  }
  nextToGoalButtonOption = {
    text: 'İleri',
    onClick: (e)=> {
      this.stepperActiveBooleans['isDatePicking']=false;
      this.stepperActiveBooleans['isProgramCreationPicking']=false;
      this.stepperActiveBooleans['isGoal']=true;
    },
    width: '130px',
    type: 'default',
    icon:'fas fa-arrow-circle-right',
  }
  submitButtonOption = {
    text: 'Gönder',
    onClick: (e)=> {
      if(this.goal !== undefined){
        this.submit(e);
      }
      if(this.goal === undefined){
        this.endDateBox.validationStatus="invalid";
        this.endDateBox.validationMessage="Bu alan gerekli";
      }
    },
    width: '130px',
    type: 'default',
    icon:'fas fa-paper-plane',
  }
  programStartDate:Date;
  programEndDate:Date;
  stepperActiveBooleans:any={
    isDatePicking:true,
    isProgramCreationPicking:false,
    isGoal:false
  };
  scheduledExerciseList: ScheduledExercise[];
  resourcesData: Resource[];
  selectedDate:Date;
  scheduledExerciseDateMap:ScheduledExerciseDateMap;
  goal:string;

  constructor(private exerciseProgramService:PhysiotherapyProgramService, private route: ActivatedRoute,
              private patientService:PatientService, private authenticationService:AuthenticationService, private doctorService:DoctorService) {

  }

  ngOnInit(): void {
  }

  submit=(e)=>{
    let username=JSON.parse(localStorage.getItem('currentUser')).username;


    this.route.parent.params.subscribe(
      (params) => {
        let scheduledExerciseList = this.convertScheduledExerciseDateMapToScheduledExerciseListForSubmit(this.scheduledExerciseDateMap);
        let phiysiotherapyProgram = new PhysiotherapyProgram();
        phiysiotherapyProgram.scheduledExerciseCollection =scheduledExerciseList;

        let date1 = new Date(this.programStartDate);
        date1.setDate(date1.getDate()+1);
        phiysiotherapyProgram.startDate=date1.toISOString() .slice(0,-5);
        date1 = new Date(this.programEndDate);
        date1.setDate(date1.getDate()+1);
        phiysiotherapyProgram.finishDate=date1.toISOString() .slice(0,-5);

        phiysiotherapyProgram.isActive=true;
        phiysiotherapyProgram.goal=this.goal;

        this.doctorService.getDoctorByUsername(username).subscribe(doctor=>{
          phiysiotherapyProgram.doctor=doctor;
          this.patientService.getPatient(params.tckimlikno).subscribe(patient=>{
            phiysiotherapyProgram.patient=patient;
            this.callSubmit(phiysiotherapyProgram);
          });
        });
      });
  }
  private callSubmit = (phiysiotherapyProgram:PhysiotherapyProgram) =>{

    this.exerciseProgramService.assignNewExerciseProgram(phiysiotherapyProgram).subscribe(
      (res) => {
        this.isLoading = false;
        this.closePopUp();
        // @ts-ignore
        swal.fire({
          title: 'Başarılı !',
          icon: 'success',
          text: 'Program Başarılı Bir Şekilde Atandı! ',
          type: 'success',
          heightAuto: false
        }).then(() => {
          this.getAllProgram.next();
        });},
      err => {
        this.isLoading = false;
        this.closePopUp();
        console.log('err: ', err);
        if (err instanceof HttpErrorResponse) {
          // @ts-ignore
          swal.fire({
            title: 'Hata Oluştu !',
            text: 'Program Ekleme İşlemi Başarısız Oldu! ',
            type: 'error',
            heightAuto: false
          });
        }else{
          // @ts-ignore
          swal.fire({
            title: 'Hata Oluştu !',
            text: 'Program Ekleme İşlemi Başarısız Oldu! ',
            icon: 'error',
            heightAuto: false
          });
        }
      });
  }
  cancelOnAppointmentFormOpening = e => {
    e.cancel = true;
  }

  openPopUpForCreate = (phiysiotherapyProgram:PhysiotherapyProgram, isEditPopUp:boolean)=>{
    this.stepperActiveBooleans = {
      isDatePicking:true,
      isProgramCreationPicking:false,
      isGoal:false
    };
    this.startDateBoxValidationMessage=undefined;
    this.endDateBoxValidationMessage=undefined;
    this.scheduledExerciseDateMap = new ScheduledExerciseDateMap();
    this.popUpContent = new PhysiotherapyProgram();
    this.isVisible = true;
    this.scheduledExerciseList = [];
    this.resourcesData = resources;
    this.now =new Date();
    this.tomorrow =new Date(this.now);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.isEditPopUp = isEditPopUp;
    if(this.isEditPopUp){
      this.programStartDate = new Date(Date.parse(phiysiotherapyProgram.startDate));
      this.programEndDate = new Date(Date.parse(phiysiotherapyProgram.finishDate));
      this.convertScheduledExerciseListToScheduledExerciseDateMap(phiysiotherapyProgram.scheduledExerciseCollection);
    }
  }
  private convertScheduledExerciseListToScheduledExerciseDateMap = (scheduledExerciseList:ScheduledExercise[])=>{
    scheduledExerciseList.forEach(scheduledExercise=>{
      let date=new Date(Date.parse(scheduledExercise.scheduledDate));
      if(this.scheduledExerciseDateMap[date.toISOString()] === undefined){
        this.scheduledExerciseDateMap[date.toISOString()] = [];
      }
      this.scheduledExerciseDateMap[date.toISOString()].push(scheduledExercise);
    });
    this.convertScheduledExerciseDateMapToScheduledExerciseListForSchedule(this.scheduledExerciseDateMap);
  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

  onExerciseProgramFormOpening = (e: any) => {
    if(!this.isDateOutOfRange(e.cellData.startDate, this.programStartDate, this.programEndDate)){
      this.selectedDate = new Date(e.cellData.startDate);
      this.selectedDate.setDate( e.cellData.startDate.getDate()+1 );
      this.exerciseFormModalComponent.openPopUpForCreate(this.scheduledExerciseDateMap[this.selectedDate.toISOString()]);
    } else{
      this.notifyDisableDate();
    }
  }

  notifyDisableDate() {
    notify("Seçtiğiniz başlangıç ve bitiş aralığı dışında egzersiz ekleyemezsiniz.", "warning", 2000);
  }

  isDateOutOfRange = (date: Date, startDate:any, endDate:any) => {

    return date<startDate || date>endDate ;
  }

  submitScheduledExercisesClicked = (selectedExercises:ScheduledExercise[])=>{
    this.scheduledExerciseDateMap[this.selectedDate.toISOString()] = selectedExercises;
    this.scheduledExerciseList = this.convertScheduledExerciseDateMapToScheduledExerciseListForSchedule(this.scheduledExerciseDateMap);
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
  convertScheduledExerciseDateMapToScheduledExerciseListForSubmit = (scheduledExerciseDateMap: ScheduledExerciseDateMap):ScheduledExercise[] =>{
    let scheduledExerciseList = [];
    for (const date in scheduledExerciseDateMap) {
      scheduledExerciseList.push.apply(scheduledExerciseList, scheduledExerciseDateMap[date]);
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
    text: "Room 402",
    id: false,
    color: "#005eff"
  }
];

let resourcess: Resource[] = [
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
