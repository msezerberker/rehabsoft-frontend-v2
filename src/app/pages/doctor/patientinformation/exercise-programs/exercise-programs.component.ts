import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenDto} from '../../../../models/tokendto';
import {PhysiotherapyProgram} from '../../../../models/exerciseprogram/physiotherapy-program';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../../../shared/services/patient.service';
import {AuthenticationService} from '../../../../security/authentication.service';
import notify from 'devextreme/ui/notify';
import {PhysiotherapyProgramService} from '../../../../shared/services/physiotherapy-program.service';
import {CreateExerciseProgramComponent} from "./create-exercise-program/create-exercise-program.component";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {ViewExerciseProgramsComponent} from "../../../../shared/components/view-exercise-program/view-exercise-programs.component";

@Component({
  selector: 'app-exercise-programs',
  templateUrl: './exercise-programs.component.html',
  styleUrls: ['./exercise-programs.component.scss'],


})
export class ExerciseProgramsComponent implements OnInit {
  @ViewChild("CreateExerciseProgramComponent") createExerciseProgramComponent:CreateExerciseProgramComponent;
  @ViewChild("ViewExerciseProgramsComponent") viewExerciseProgramsComponent:ViewExerciseProgramsComponent;

  loading = false;
  error = '';
  assignedprogramList: PhysiotherapyProgram[];
  tcKimlikNo:string;
  username: string;
  currentUser: TokenDto;
  popUpVisible: boolean = false;


  constructor(private exerciseProgramService:PhysiotherapyProgramService, private router: Router, route: ActivatedRoute, private patientService:PatientService, private authenticationService:AuthenticationService) {
    this.assignedprogramList = [];
    route.parent.params.subscribe(
      (params) =>
      {
        this.tcKimlikNo= params.tckimlikno;
      });
    authenticationService.currentUser.subscribe(user=>{
      this.currentUser = user;
      this.username=JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getAllAssignedExercises();
  }

  getAllAssignedExercises = ()=>{
    this.exerciseProgramService.getAllAssigned(this.tcKimlikNo).subscribe(
      (data)=>{
        this.assignedprogramList = data;
      },
      (error)=>{
        notify(error);
      }
    );
  }

  openCreateProgramPopUp(): void {
    this.createExerciseProgramComponent.openPopUpForCreate(undefined,false);
  }

  delIconClick = (event)=>{
    // confirm(+' '+ 'silinsin mi?', 'Emin misiniz?')
    //   .then((dialogResult) => {
    //   alert(dialogResult ? "Silindi" : "İptal edildi", "Başarılı");
    // });

    // @ts-ignore
    swal.fire({
      title: 'Emin misiniz?',
      text: event.row.data.id + ' numaralı egzersiz kalıcı olarak silinecektir!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      heightAuto: false
    })
      .then((result) => {
        if (result.value) {

          this.exerciseProgramService.deleteById(event.row.data.id).subscribe((res) => {
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
  editIconClick = (e)=>{
    let now = new Date();
    if(now>=new Date(Date.parse(e.row.data.startDate))){
      notify("Başlangıç tarihi sonrası egzersizi güncelleyemezsiniz.", "error", 3000);
    } else{
      this.createExerciseProgramComponent.openPopUpForCreate(e.row.data, true);
    }
  }

  previewIconClick=(e)=>{
    this.viewExerciseProgramsComponent.openPopUpForView(e.row.data, false);
  }
}
