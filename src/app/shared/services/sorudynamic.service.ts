import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AssignedSoru} from '../../models/dynamicsoru/assignedsoru';
import {SoruTemplate} from "../../models/dynamicsoru/sorutemplate";

@Injectable({providedIn: 'root'})
export class SoruDynamicService {

  constructor(private http: HttpClient) { }

  // For Doctors
  getAllAssigned(tcKimlikNo:string) {
    return this.http.get<AssignedSoru[]>(`${environment.API_BASE_PATH}/soru-dynamic/history/${tcKimlikNo}`);
  }

  assignSoru(assignedSoru: AssignedSoru, tcKimlikNo: string){
    return this.http.post<any>(`${environment.API_BASE_PATH}/soru-dynamic/assignsoru/${tcKimlikNo}`, assignedSoru);
  }

  getAllTemplates(userName:string){
    return this.http.get<SoruTemplate[]>(`${environment.API_BASE_PATH}/soru-dynamic/get-all-templates/${userName}`);
  }

  addTemplate(soruTemplate: SoruTemplate, userName : string){
    return this.http.post<any>(`${environment.API_BASE_PATH}/soru-dynamic/add-template/${userName}`, soruTemplate);
  }

  assignSoruSoruTemplate(tcKimlikNo : string, templateID : string){
    return this.http.post<any>(`${environment.API_BASE_PATH}/soru-dynamic/add-soru-soru-template/${templateID}`, tcKimlikNo);
  }

  findTemplateByID(id :string){
    return this.http.get<SoruTemplate>(`${environment.API_BASE_PATH}/soru-dynamic/get-template/${id}`);
  }


  // For Patients
  getAllAssignedNotAnswered(tcKimlikNo: string){
    return this.http.get<AssignedSoru[]>(`${environment.API_BASE_PATH}/soru-dynamic/requests-not-answered/${tcKimlikNo}`);
  }

  getAllAssignedAnswered(tcKimlikNo: string){
    return this.http.get<AssignedSoru[]>(`${environment.API_BASE_PATH}/soru-dynamic/requests-answered/${tcKimlikNo}`);
  }

  findAssignSoruById(id : string){
    return this.http.get<AssignedSoru>(`${environment.API_BASE_PATH}/soru-dynamic/get-assigned-soru/${id}`);
  }

  answerTheSoru(assignedSoru: AssignedSoru, soruID: string){
    return this.http.post<any>(`${environment.API_BASE_PATH}/soru-dynamic/answer-the-soru/${soruID}`, assignedSoru);
  }
}
