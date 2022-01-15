import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PhysiotherapyProgram} from '../../models/exerciseprogram/physiotherapy-program';

@Injectable({ providedIn: 'root' })
export class PhysiotherapyProgramService{

  constructor(private http: HttpClient) {
  }

  getAllAssigned(tcKimlikNo:string) {
    return this.http.get<PhysiotherapyProgram[]>(`${environment.API_BASE_PATH}/physiotherapy-program/get-all-assigned/${tcKimlikNo}`);
  }

  assignNewExerciseProgram(program:PhysiotherapyProgram ) {
    return this.http.post<any>(`${environment.API_BASE_PATH}/physiotherapy-program/assign-new`, program);
  }

  deleteById(id:number){
    return this.http.get<any>(`${environment.API_BASE_PATH}/physiotherapy-program/delete/${id}`);
  }

  update(program:PhysiotherapyProgram){
    return this.http.post<any>(`${environment.API_BASE_PATH}/physiotherapy-program/update`, program);
  }

  getById(id:number){
    return this.http.get<PhysiotherapyProgram>(`${environment.API_BASE_PATH}/physiotherapy-program/getById/${id}`);
  }
}
