import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

import notify from 'devextreme/ui/notify';
import { AdminCrudService } from 'src/app/shared/services/admin-crud.service';
import { UserCrud } from 'src/app/models/user-crud';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { NewDoctorAccountComponent } from './new-doctor-account/new-doctor-account.component';


@Component({
  selector: 'app-doctors-crud',
  templateUrl: './doctors-crud.component.html',
  styleUrls: ['./doctors-crud.component.scss']
})
export class DoctorsCrudComponent implements OnInit {

  @ViewChild(NewDoctorAccountComponent) createDoctorAccountComponent:NewDoctorAccountComponent;

  email:string;
  dataSource: UserCrud[];
  generalEvalFormurl:string;

  constructor(private admincrudService:AdminCrudService, private router:Router) {
      this.dataSource;
      
  }
  ngOnInit(){
    this.getAllDoctors();
   
  }


  getAllDoctors = ()=>{
    this.admincrudService.getAllDoctors().subscribe(
      (data)=>{
        //console.log("Service data:", data);
        this.dataSource = data;
      },
      (error)=>{
        notify(error);
      }
    );
  }


  viewButtonClick = (e) =>{
    console.log("butona basildi");
    //this.router.navigate(['doctor/patient-info/',e.row.data.tcKimlikNo]);
    //this.generalEvalFormurl = "../exercises";
  }

  okClicked (e) {
    notify("The OK button was clicked")
}


deleteButtonClick = (event) =>{
  console.log("butona basildi");
  
  Swal.fire({
    title: 'Emin misiniz?',
    text: event.row.data.firstName + " " +  event.row.data.surname +' isimli doktor sistemden kalıcı olarak silinecektir!',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    heightAuto: false
  })
    .then((result) => {
      if (result.value) {

        this.admincrudService.deleteDoctorById(event.row.data.id).subscribe((res) => {
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

createNewDoctorAccount = (e)=>{
  this.createDoctorAccountComponent.openPopUpForCreate();
}


}
