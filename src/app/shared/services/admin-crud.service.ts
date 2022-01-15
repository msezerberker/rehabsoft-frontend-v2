
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ResponseMessage } from 'src/app/models/responsemessage';
import { UserCrud } from 'src/app/models/user-crud';
import { NewAccountRequest } from 'src/app/models/new-account-request';

@Injectable({
  providedIn: 'root'
})
export class AdminCrudService {

  constructor(private http: HttpClient) {

  }


  getAllPatients() {
    return this.http.get<UserCrud[]>(`${environment.API_BASE_PATH}/admin/patients`);
    
  }

  getAllDoctors() {
    return this.http.get<UserCrud[]>(`${environment.API_BASE_PATH}/admin/doctors`);
    
  }

  getAllAdmins() {
    return this.http.get<UserCrud[]>(`${environment.API_BASE_PATH}/admin/admins`);
  }

  deletePatientById(id:number) {
    return this.http.delete<ResponseMessage>(`${environment.API_BASE_PATH}/admin/deletepatient/${id}`);
  }

  deleteDoctorById(id:number) {
    return this.http.delete<ResponseMessage>(`${environment.API_BASE_PATH}/admin/deletedoctor/${id}`);
  }

  deleteAdminById(id:number) {
    return this.http.delete<ResponseMessage>(`${environment.API_BASE_PATH}/admin/deleteadmin/${id}`);
  }

  saveDoctorAccount(regRequest: NewAccountRequest) {
    return this.http.post<ResponseMessage>(`${environment.API_BASE_PATH}/admin/savedoctor`,regRequest);
  }

  saveAdminAccount(regRequest: NewAccountRequest) {
    return this.http.post<ResponseMessage>(`${environment.API_BASE_PATH}/admin/saveadmin`,regRequest);
  }



}
