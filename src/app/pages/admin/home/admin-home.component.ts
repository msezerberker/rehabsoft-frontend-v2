import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'admin-home.component.html',
  styleUrls: [ './admin-home.component.scss' ]
})

export class AdminHomeComponent {
  constructor(private router:Router) {console.log('----------------constructor');}




  DoctorButtonNavigate = ()=>{
    this.router.navigateByUrl('/admin/doctorscrud');
  }

  AdminButtonNavigate = ()=>{
    this.router.navigateByUrl('/admin/adminscrud');


  }

  PatientButtonNavigate = ()=>{
    this.router.navigateByUrl('/admin/patientcrud');


  }



}
