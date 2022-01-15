import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Doctor} from "../../models/doctor";



@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private http: HttpClient) {}

  getDoctorByUsername(username:string){
    return this.http.get<Doctor>(`${environment.API_BASE_PATH}/doctor/getByUsername/${username}`);
  }
}
