import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { PatientDetails } from 'src/app/models/patientdetails';

import {DoctorInfo} from 'src/app/models/doctor-info';
import {Patient} from '../../models/patient';
import {Doctor} from '../../models/doctor';
import {AssignedForm} from '../../models/dynamicform/assignedform';

@Injectable({ providedIn: 'root' })
export class PatientService {

    constructor(private http: HttpClient) {

    }

    getAll() {
        return this.http.get<PatientDetails[]>(`${environment.API_BASE_PATH}/patient/all`);
      }

    getAllPatientByDoctor(doctorUserID:string) {
      return this.http.get<PatientDetails[]>(`${environment.API_BASE_PATH}/patient/getByDoctor/${doctorUserID}`);
    }

    getPatientByTcKimlikNo(tcKimlikNo:string){
      return this.http.get<PatientDetails>(`${environment.API_BASE_PATH}/patient/${tcKimlikNo}`);
    }

    getDoctorInfo(){
      return this.http.get<DoctorInfo>(`${environment.API_BASE_PATH}/patient/doctorinfo`);
    }

    getNewRegistredPatient() {
      return this.http.get<Patient[]>(`${environment.API_BASE_PATH}/patient/getnewregistredpatient`);
    }

    getDoctors() {
      return this.http.get<Doctor[]>(`${environment.API_BASE_PATH}/doctor/getall`);
    }

  assignDoctorToPatient(doctorUserID: string, tcKimlikNo: string){
    return this.http.post<any>(`${environment.API_BASE_PATH}/patient/assigndoctor/${tcKimlikNo}`, doctorUserID);
  }

  getPatient(tcKimlikNo:string){
    return this.http.get<Patient>(`${environment.API_BASE_PATH}/patient/get/${tcKimlikNo}`);
  }

  getPatientsByDoctor(doctorUsername:string){
    return this.http.get<Patient[]>(`${environment.API_BASE_PATH}/patient/getPatientByDoctor/${doctorUsername}`);
  }

}
