import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Parent} from "../../../../models/parent";
import {AuthenticationService} from "../../../../security/authentication.service";
import {Patient} from "../../../../models/patient";
import {UserService} from "../../../../shared/services/user.service";
import {Phone} from "../../../../models/phone";

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit, OnDestroy  {

  loading = false;
  error = '';

  currentUser: any;

// Patient variable
  @Input()
  addPhoneButtonOptions1: any;
  @Input()
  addPhoneButtonOptions2: any;
  @Input()
  phoneOptions1: any;
  @Input()
  phoneOptions2: any;

  @Input()
  patientForm:any;

  @Output() nextStepper: EventEmitter<any> = new EventEmitter();
  goNextForm = (event)=>{
    // stop here if form is invalid
    if (!event.validationGroup.validate().isValid) {
      return;
    }
    this.loading = true;
    this.fillParenCollectionFromPatientFrom();
    this.nextStepper.emit();
  }

  private fillParenCollectionFromPatientFrom = () =>{
    let newPatient = {...this.userService.getPatient};
    newPatient.parentCollection = [];
    let parent1 = this.parentCreator(1);
    let parent2 = this.parentCreator(2);

    newPatient.parentCollection.push(parent1);
    newPatient.parentCollection.push(parent2);

    this.authenticationService.currentUser.subscribe(user=> {
      newPatient.tcKimlikNo = user.username;
      this.userService.setPatient = newPatient;
    });

  }

  private parentCreator = (whichParent:number) =>{
    let parent:Parent = new Parent();
    parent.firstname = (whichParent===1) ? this.patientForm.parent1.firstname.trim() :  this.patientForm.parent2.firstname.trim();
    parent.surname = (whichParent===1) ? this.patientForm.parent1.surname.trim() : this.patientForm.parent2.surname.trim();
    parent.parentType = (whichParent===1) ? this.patientForm.parent1.parentType.trim() : this.patientForm.parent2.parentType.trim();
    parent.email = (whichParent===1) ? this.patientForm.parent1.email.trim() : this.patientForm.parent2.email.trim();
    parent.phoneCollection = [];
    if(whichParent===1){
      this.patientForm.phoneNumberListForParent1.forEach(phoneNumber=>{
        let phoneToAddParent = new Phone();
        phoneToAddParent.phoneNumber = phoneNumber;
        parent.phoneCollection.push(phoneToAddParent);
      });
    }else{
      this.patientForm.phoneNumberListForParent2.forEach(phoneNumber=>{
        let phoneToAddParent = new Phone();
        phoneToAddParent.phoneNumber = phoneNumber;
        parent.phoneCollection.push(phoneToAddParent);
      });
    }
    return parent;
  }

  nextbuttonOptions:any = {useSubmitBehavior: false, text: 'İleri', onClick: (event)=>this.goNextForm(event),
    width: '130px',type:"default", icon: 'fas fa-arrow-circle-right'};



  constructor(private userService: UserService, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }



}
