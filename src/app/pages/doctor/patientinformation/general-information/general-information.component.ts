import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { PatientService } from 'src/app/shared/services/patient.service';
import {PatientDetails} from "../../../../models/patientdetails"

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  dataSource: PatientDetails;
  colCountByScreen:object;
  tcKimlikNo:string;

  constructor(private patientService:PatientService,route: ActivatedRoute) {
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    };



    route.parent.params.subscribe(
      (params) => 
      { 
            this.tcKimlikNo= params.tckimlikno; 
       });

    console.log("GENERALINFO tcKimlikNUMARA:",this.tcKimlikNo);
    
}

   ngOnInit(){
    this.getPatient();
  }

  getPatient = ()=>{
    this.patientService.getPatientByTcKimlikNo(this.tcKimlikNo).subscribe(
      (data)=>{
        console.log("Patient Service data:", data);
        this.dataSource = data;
      },
      (error)=>{
        notify("Hasta formu doldurmamıştır veya kaydı bulunmamaktadır.");
      }
    );
  }


}
