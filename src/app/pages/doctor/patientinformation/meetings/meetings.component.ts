import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import { PatientService } from 'src/app/shared/services/patient.service';
import {PatientDetails} from "../../../../models/patientdetails"
import {OnlineMeeting} from "../../../../models/online-meeting";
import {OnlineMeetingService} from "../../../../shared/services/online-meeting.service";
import {AuthenticationService} from "../../../../security/authentication.service";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {DxFormComponent} from "devextreme-angular";
import {Patient} from "../../../../models/patient";
import {Doctor} from "../../../../models/doctor";
import {DoctorService} from "../../../../shared/services/doctor.service";

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit{
  @ViewChild('dxAddMeetingForm') validationFormComponent: DxFormComponent

  dataSource:OnlineMeeting[];
  patient: Patient;
  patientTc:string;
  username: string;
  doctor:Doctor;
  popupVisible: boolean=false;

  constructor(private onlineMeetingsService:OnlineMeetingService, private route: ActivatedRoute, private patientService: PatientService,
              private doctorService:DoctorService) {

    this.username=JSON.parse(localStorage.getItem('currentUser')).username;
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(
      (params) => {
        this.patientTc = params.tckimlikno;
        this.getAllMeetings();
        this.getAllPatientByDoctor();
        this.getDoctorByUsername();
        this.getPatientByTckimlikNo();
      });
  }

  /*********** Service Callers ************/
  getAllMeetings = ()=>{
    this.onlineMeetingsService.getAllByUsername(this.username).subscribe(data=>{
      this.dataSource = data;
    });
  }
  getAllPatientByDoctor = () =>{
    this.patientService.getPatientsByDoctor(this.username).subscribe(data=>{
      data.forEach((patient)=>{
        this.patientsSelectBox.push({
          name: patient.tcKimlikNo + " - "+patient.user.firstName+" "+patient.user.surname,
          value: patient.user.id
        })
      });
    });
  }
  getDoctorByUsername = () =>{
    this.doctorService.getDoctorByUsername(this.username).subscribe(data=>{
      this.doctor = data;
    });
  }
  getPatientByTckimlikNo=()=>{
    this.patientService.getPatient(this.patientTc).subscribe(data=>{
      this.patient = data;
    });
  }


  addMeetingModalButtonClicked = () =>{
    this.popupVisible = true;
    this.isLoading=false;
    this.addedMeeting = new OnlineMeeting();
    this.addedMeeting.doctorUser = this.doctor.user;
    this.patientsSelectBox.forEach(patient=>{
      if(patient.name === this.patient.tcKimlikNo+" - "+ this.patient.user.firstName+" "+ this.patient.user.surname){
        this.addedMeeting["patientId"] = this.patient.user.id;
      }
    })
  }



  /*********** Add Meeting Modal start *************/
  patientsSelectBox=[]
  minDate=Date();
  addedMeeting:OnlineMeeting;
  isLoading:boolean=false;
  cancelAddMeetingButtonOption = {
    text: 'Vazgeç',
    onClick: (e)=>this.cancelAddMeeting(e),
    width: '130px',
    type: 'outlined',
  }
  submitMeetingButtonOption = {
    text: 'Kaydet',
    onClick: (e)=>this.submitMeeting(e),
    width: '130px',
    type: 'default',
    icon:'fas fa-save',
  }
  cancelAddMeeting = (e)=>{
    this.closePopUp();
  }
  submitMeeting = (e)=>{
    //validate from outside of form example
    if (! this.validationFormComponent.instance.validate().isValid) {
      return;
    }
    delete this.addedMeeting["patientId"];

    this.isLoading = true

    this.addedMeeting.meetingDate = new Date(this.addedMeeting.meetingDate.getTime() + (1000 * 60 * 60 * 3));
    this.addedMeeting.meetingDate = this.addedMeeting.meetingDate.toISOString().replace('T',' ').slice(0,-5);

    this.addedMeeting.patientUser = this.patient.user;
    this.onlineMeetingsService.save(this.addedMeeting).subscribe(
      (res) => {
        this.isLoading = false;
        this.closePopUp();
        // @ts-ignore
        swal.fire({
          title: 'Başarılı !',
          icon: 'success',
          text: 'Görüşme Başarılı Bir Şekilde Eklendi! ',
          type: 'success',
          heightAuto: false
        }).then(() => {
          this.getAllMeetings();
        });},
      err => {
        this.isLoading = false;
        console.log('err: ', err);
        if (err instanceof HttpErrorResponse) {
          // @ts-ignore
          swal.fire({
            title: 'Hata Oluştu !',
            text: 'Ekleme İşlemi Başarısız Oldu! ',
            type: 'error',
            heightAuto: false
          });
        }else{
          // @ts-ignore
          swal.fire({
            title: 'Hata Oluştu !',
            text: 'Ekleme İşlemi Başarısız Oldu! ',
            icon: 'error',
            heightAuto: false
          });
        }
      });
  }
  closePopUp=()=>{
    this.popupVisible = false;
  }
  /*********** Add Meeting Modal end *************/


  delIconClicked=(meeting:OnlineMeeting)=>{
    // @ts-ignore
    swal.fire({
      title: 'Emin misiniz?',
      text: meeting.meetingDate + ' tarihli görüşme kalıcı olarak silinecektir!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      heightAuto: false
    })
      .then((result) => {
        if (result.value) {

          this.onlineMeetingsService.deleteById(meeting.id).subscribe((res) => {
              // @ts-ignore
              swal.fire({
                title: 'Başarılı !',
                icon: 'success',
                text: 'Silme İşlemi Başarılı Bir Şekilde Yapıldı! ',
                type: 'success',
                heightAuto: false
              }).then(() => {
                this.ngOnInit();
              });
            },
            err => {
              console.log('err: ', err);
              if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                  // @ts-ignore
                  swal.fire({
                    title: 'Hata Oluştu !',
                    text: 'Silme İşlemi Başarısız Oldu! ',
                    type: 'error',
                    heightAuto: false
                  });
                  // this.router.navigate(['/login']);
                }
              }
            });
        }
      });
  }

}
