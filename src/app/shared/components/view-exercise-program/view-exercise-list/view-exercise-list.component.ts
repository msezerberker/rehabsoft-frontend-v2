import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {ScheduledExercise} from "../../../../models/exerciseprogram/scheduledexercise";
import {Exercise} from "../../../../models/exercise/exercise";
import {ExerciseService} from "../../../services/exercise.service";
import {PhysiotherapyProgram} from "../../../../models/exerciseprogram/physiotherapy-program";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {ScheduledExerciseService} from "../../../services/scheduled-exercise.service";
import notify from "devextreme/ui/notify";
import { on } from "devextreme/events";


@Component({
  selector: 'app-view-exercise-list-component',
  templateUrl: './view-exercise-list.component.html',
  styleUrls: ['./view-exercise-list.component.scss'],


})
export class ViewExerciseListComponent implements OnInit {
  @ViewChild("viewExerciseComponent") viewExerciseComponent;


  @Output()
  getPhysioteraphyProgram = new EventEmitter<ScheduledExercise[]>();
  selectedScheduledExercises=[];
  scheduledExerciseListWithName: any[];
  exercises:Exercise[];
  allScheduledExerciseList:ScheduledExercise[];

  isVisible:boolean =false;
  isEditPopUp:boolean =false;
  _exerciseDate;
  _showedExerciseDate;
  @Input()
  set exerciseDate(data:Date){
    if(data!==undefined){
      this._exerciseDate = data.toISOString().slice(0,-5);
      let showedDate= new Date(data);
      showedDate.setDate(showedDate.getDate()-1);
      this._showedExerciseDate = showedDate.toLocaleString().slice(0,-13);
    }
  }
  cancelButtonOption = {
    text: 'Vazgeç',
    onClick: (e)=>{
      this.closePopUp();
    },
    width: '130px',
    type: 'outlined',
  }
  callSubmit = () =>{

    //update as isApplied as true
    this.selectedScheduledExercises.forEach(scheduledExercise=>{
      delete scheduledExercise["exerciseName"];
      scheduledExercise.isApplied = true;
      console.log("scheduledExercise",scheduledExercise);
    });

    // add not selected as not applied
    this.allScheduledExerciseList.forEach(scheduledExercise=>{
      if(!this.selectedScheduledExercises.map(selectedExercise=>selectedExercise.id).includes(scheduledExercise.id)){
        scheduledExercise.isApplied = false;
        this.selectedScheduledExercises.push(scheduledExercise);
      }
    });


    this.scheduledExerciseService.updateScheduledExerciseList(this.selectedScheduledExercises).subscribe(
      (res) => {
        console.log(res);
        if(res.responseMessage ==="islem basarili"){
          this.closePopUp();
          notify("Egzersizler Tamamlandı!", "success", 2000);
          this.getPhysioteraphyProgram.next();
          this.closePopUp();
        } else{
          notify("Egzersiz Tamamlama İşlemi Başarısız Oldu!", "warning", 2000);
          this.closePopUp();
        }
      });
  }
  submitButtonOption = {
    text: 'İşaretlemeleri Kaydet',
    onClick: (e)=>{
      this.callSubmit();
    },
    width: '130px',
    type: 'default',
    icon:'fas fa-save',
  }

  constructor(private scheduledExerciseService:ScheduledExerciseService) {
  }

  viewExerciseClicked = (e) =>{
    this.viewExerciseComponent.openPopUp(e.exercise);
  }

  openPopUpForView = (scheduledExerciseList:ScheduledExercise[])=>{
    this.allScheduledExerciseList = scheduledExerciseList;
    this.scheduledExerciseListWithName = scheduledExerciseList.map(scheduledExercise=>{
      scheduledExercise["exerciseName"] = scheduledExercise.exercise.exerciseName;
      return scheduledExercise;
    });
    this.selectedScheduledExercises =(scheduledExerciseList===undefined)?[]:scheduledExerciseList.filter(scheduledExercise=>scheduledExercise.isApplied);

    this.isVisible = true;
    this.isEditPopUp = false;
  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

  ngOnInit(): void {
  }

  onContentReady = (e) => {
    let itemContent = e.element.querySelectorAll(".dx-item-content");
    on(itemContent, "dxclick", function (event, extraParameters) {
      event.stopPropagation();
    });
  }

}
