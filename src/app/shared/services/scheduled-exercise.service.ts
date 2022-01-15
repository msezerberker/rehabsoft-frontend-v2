import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ScheduledExercise} from "../../models/exerciseprogram/scheduledexercise";

@Injectable({ providedIn: 'root' })
export class ScheduledExerciseService{

  constructor(private http: HttpClient) {
  }

  updateScheduledExerciseList(scheduledExercises:ScheduledExercise[]) {
    return this.http.post<any>(`${environment.API_BASE_PATH}/scheduled-exercise/update-applied/`,scheduledExercises);
  }

}
