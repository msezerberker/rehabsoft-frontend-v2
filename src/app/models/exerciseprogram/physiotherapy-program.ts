import {Doctor} from '../doctor';
import {Patient} from '../patient';
import {ScheduledExercise} from "./scheduledexercise";

export class PhysiotherapyProgram{
  id: number;
  creationDate : any;
  doctor : Doctor;
  goal : string;
  patient: Patient;
  isActive : boolean;
  startDate : any;
  finishDate : any;
  scheduledExerciseCollection: ScheduledExercise[];
 }
