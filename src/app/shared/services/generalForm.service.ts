import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeneralFormService {

  constructor(private http: HttpClient) {

  }

  getByTcKimlikNo(tcKimlikNo:string) {
    return this.http.get<any>(`${environment.API_BASE_PATH}/patient/generalevaluationform/get-form/${tcKimlikNo}`);
  }

  getBotoxImageByBotoxTreatmentId(id:number){
    return this.http.get(`${environment.API_BASE_PATH}/patient/generalevaluationform/getbotoximage/${id}`, {
      responseType: 'blob'});
  }

  getEpiCrisisImageByAppliedSurgeryId(id:number){
    return this.http.get(`${environment.API_BASE_PATH}/patient/generalevaluationform/getepicrisisimage/${id}`, {
      responseType: 'blob'});
  }

  getOrthesisImage(id:number){
    return this.http.get(`${environment.API_BASE_PATH}/patient/generalevaluationform/getorthesisimage/${id}`, {
      responseType: 'blob'});
  }
}
