import {Component, ViewChild} from '@angular/core';
import {Exercise} from "../../../models/exercise/exercise";
import {ExerciseService} from "../../../shared/services/exercise.service";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import { alert } from "devextreme/ui/dialog";
import swal from 'sweetalert2';

import {ExerciseImage} from "../../../models/exercise/exerciseimage";
import {ExerciseVideo} from "../../../models/exercise/exercisevideo";
import {User} from "../../../models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {DoctorCreateExerciseComponent} from "./createexercise/doctor-createexercise.component";
import {ViewExerciseComponent} from "../../../shared/components/view-exercise/view-exercise.component";

@Component({
  templateUrl: 'doctor-exerciseManagment.component.html',
  styleUrls: ['./doctor-exerciseManagment.component.scss']
})

export class DoctorExerciseManagmentComponent{

  @ViewChild(DoctorCreateExerciseComponent) createExerciseComponent:DoctorCreateExerciseComponent;
  @ViewChild(ViewExerciseComponent) viewExerciseComponent:ViewExerciseComponent;


  // Buton options
  yeniButtonOptions = {
    text: 'Ekle',
    icon: 'plus',
    onClick: (e) => {
      this.createNewExercise(e);
    }
  };
  refreshButtonOptions = {
    text: 'Yenile',
    icon: 'refresh',
    onClick: () => {
      this.getItemsList();
    }
  };

  allowedPageSizesArray =  [5, 10, 20, 50, 100];
  dataSource: any[];


  constructor(private exerciseService: ExerciseService ) {


  }

  ngOnInit() {
    this.getItemsList();
  }

  getItemsList = ()=>{
    this.exerciseService.getAll().subscribe(
      (data)=>{
        data.forEach(exercise=>{
          exercise["creatorNameSurname"] = exercise.user.firstName+' '+exercise.user.surname;
        })
        console.log(data);
        this.dataSource = data;
      },
      (error)=>{
        notify(error);
      }
    );
  }

  editIconClick = (e: any) => {
    this.createExerciseComponent.openPopUpForEdit(e.row.data);
  }

  delIconClick = (event)=>{
    // confirm(+' '+ 'silinsin mi?', 'Emin misiniz?')
    //   .then((dialogResult) => {
    //   alert(dialogResult ? "Silindi" : "İptal edildi", "Başarılı");
    // });

    // @ts-ignore
    swal.fire({
      title: 'Emin misiniz?',
      text: event.row.data.exerciseName + ' isimli egzersiz kalıcı olarak silinecektir!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      heightAuto: false
    })
      .then((result) => {
        if (result.value) {

          this.exerciseService.deleteById(event.row.data.id).subscribe((res) => {
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

  createNewExercise = (e)=>{
    this.createExerciseComponent.openPopUpForCreate();
  }

  previewIconClick = (e)=>{
    this.viewExerciseComponent.openPopUp(e.row.data);
  }
}
