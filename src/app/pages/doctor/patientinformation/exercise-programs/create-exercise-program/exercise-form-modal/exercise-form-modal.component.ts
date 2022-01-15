import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PhysiotherapyProgramService} from "../../../../../../shared/services/physiotherapy-program.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PatientService} from "../../../../../../shared/services/patient.service";
import {AuthenticationService} from "../../../../../../security/authentication.service";
import {ExerciseService} from "../../../../../../shared/services/exercise.service";
import {Exercise} from "../../../../../../models/exercise/exercise";
import {PhysiotherapyProgram} from "../../../../../../models/exerciseprogram/physiotherapy-program";
import {ScheduledExercise} from "../../../../../../models/exerciseprogram/scheduledexercise";

@Component({
  selector: 'app-exercise-form-modal-component',
  templateUrl: './exercise-form-modal.component.html',
  styleUrls: ['./exercise-form-modal.component.scss'],


})
export class ExerciseFormModalComponent implements OnInit {

  @Output()
  submitExercises = new EventEmitter<ScheduledExercise[]>();
  selectedExercises=[];
  exercisesTagBoxes: any[];
  exercises:Exercise[];

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
  prepareScheduledExercise = (exerciseIds:number[])=>{
    let scheduledExercises = [];

    exerciseIds.forEach(exerciseId=>{
      let scheduledExercise = new ScheduledExercise();
      scheduledExercise.exercise = this.exercises.filter(exercise=>exercise.id===exerciseId)[0];
      scheduledExercise.isApplied=false;
      scheduledExercise.scheduledDate=this._exerciseDate;
      scheduledExercises.push(scheduledExercise);
    });

    return scheduledExercises;
  }
  submitButtonOption = {
    text: 'Kaydet',
    onClick: (e)=>{
      this.submitExercises.next(this.prepareScheduledExercise(this.selectedExercises));
      this.closePopUp();
    },
    width: '130px',
    type: 'default',
    icon:'fas fa-save',
  }

  constructor(private exerciseService:ExerciseService) {
  }

  openPopUpForCreate = (scheduledExerciseList)=>{
    this.exercisesTagBoxes=[];
    this.exerciseService.getAll().subscribe(data=>{
      this.exercises = data;
      data.forEach(exercise=>{
        this.exercisesTagBoxes.push({
          exerciseName:exercise.exerciseName,
          id:exercise.id
        });
      });
    });
    this.selectedExercises =(scheduledExerciseList==undefined)?[]:scheduledExerciseList.map(scheduledExercise=>scheduledExercise.exercise.id);

    this.isVisible = true;
    this.isEditPopUp = false;
  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

  ngOnInit(): void {
  }


}
