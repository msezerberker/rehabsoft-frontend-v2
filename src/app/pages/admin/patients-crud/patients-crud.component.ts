import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import notify from 'devextreme/ui/notify';
import { AdminCrudService } from 'src/app/shared/services/admin-crud.service';
import { UserCrud } from 'src/app/models/user-crud';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-patients-crud',
  templateUrl: './patients-crud.component.html',
  styleUrls: ['./patients-crud.component.scss']
})
export class PatientsCrudComponent implements OnInit {


  email:string;
  dataSource: UserCrud[];
  generalEvalFormurl:string;

  constructor(private admincrudService:AdminCrudService, private router:Router) {
      this.dataSource;
      
  }
  ngOnInit(){
    this.getAllPatients();
   
  }


  getAllPatients = ()=>{
    this.admincrudService.getAllPatients().subscribe(
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
  
  Swal.fire({
    title: 'Emin misiniz?',
    text: event.row.data.firstName + " " +  event.row.data.surname +' isimli hasta sistemden kalıcı olarak silinecektir!',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    heightAuto: false
  })
    .then((result) => {
      if (result.value) {

        this.admincrudService.deletePatientById(event.row.data.id).subscribe((res) => {
            // @ts-ignore
            swal.fire({
              title: 'Başarılı !',
              icon: 'success',
              text: 'Hasta silme İşlemi Başarılı Bir Şekilde Yapıldı! ',
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
