import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ResetPasswordFormComponent, ChangePasswordFormComponent } from './shared/components';
import { LoginComponent, CreateAccountFormComponent, FooterModule } from './shared/components';

import { UserHomeComponent } from './pages/user/home/user-home.component';
import { UserProfileComponent } from './pages/user/profile/user-profile.component';
import { UserTasksComponent } from './pages/user/tasks/user-tasks.component';

import { AuthGuard } from './security/auth.guard';
import { NotfoundUserDoctorComponent } from './shared/notfound-user-doctor/notfound-user-doctor.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { Role } from './models/role';
import { UserComponent } from './pages/user/user.component';
import { DoctorProfileComponent } from './pages/doctor/profile/doctor-profile.component';
import { DoctorTasksComponent } from './pages/doctor/tasks/doctor-tasks.component';
import { DoctorHomeComponent } from './pages/doctor/home/doctor-home.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { AdminProfileComponent } from './pages/admin/profile/admin-profile.component';
import { AdminTasksComponent } from './pages/admin/tasks/admin-tasks.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminHomeComponent } from './pages/admin/home/admin-home.component';
import { PagesComponent } from './pages/pages.component';
import { SideNavOuterToolbarModule } from './layouts';
import { NecessaryFormsComponent } from './pages/user/necessaryforms/necessary-forms.component';
import { PatientinformationComponent } from "./pages/doctor/patientinformation/patientinformation.component"
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

// Devextreme
import {
    DxListModule,
    DxPopupModule,
    DxProgressBarModule,
    DxScrollViewModule,
    DxTabPanelModule,
    DxToolbarModule,
    DxTooltipModule,
    DxTextBoxModule,
    DxSankeyComponent,
    DxSankeyModule,
    DxDateBoxModule,
    DxSchedulerModule
} from 'devextreme-angular';
import {
  DxAccordionModule, DxBoxModule, DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule, DxFileUploaderModule,
  DxFormModule,
  DxLoadIndicatorModule, DxNumberBoxModule, DxRadioGroupModule, DxSelectBoxModule,
  DxSliderModule,
  DxTagBoxModule,
  DxTemplateModule, DxTextAreaModule
} from 'devextreme-angular';

// MdBootstrap
import { WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PatientFormComponent } from "./pages/user/necessaryforms/patientform/patient-form.component";
import { DemographicFeaturesComponent } from "./pages/user/necessaryforms/demographic-features/demographic-features.component";
import { UserNotificationComponent } from "./pages/user/notifiaction/user-notification.component";
import { DoctorExerciseManagmentComponent } from './pages/doctor/exerciseManagment/doctor-exerciseManagment.component';
import { DoctorCreateExerciseComponent } from "./pages/doctor/exerciseManagment/createexercise/doctor-createexercise.component";
import { ViewExerciseComponent } from "./shared/components/view-exercise/view-exercise.component";
import { VideoPlayerComponent } from "./shared/components/video-player/video-player.component";
import { DxoItemDraggingModule } from "devextreme-angular/ui/nested";
import { ListPatientsComponent } from './pages/doctor/list-patients/list-patients.component';
import { PatientGefdInformationComponent } from './pages/doctor/patientinformation/patient-gefd-information/patient-gefd-information.component';
import { GeneralInformationComponent } from './pages/doctor/patientinformation/general-information/general-information.component';

import { VideoRequestComponent } from './pages/doctor/patientinformation/video-request/video-request.component';
import {NotificationListComponent} from "./shared/components/notification-list/notification-list.component";

import {UserResponseVideoRequestComponent} from './pages/user/response-video-request/user-response-video-request.component';

import {ExerciseMediaCarouselComponent} from "./shared/components/view-exercise/exercise-media-carousel/exercise-media-carousel.component";
import {AsynImageComponent} from "./shared/components/asyn-image/asyn-image.component";
import {UserVideoSubmitPopupComponent} from "./pages/user/response-video-request/user-video-submit-popup/user-video-submit-popup.component";
import {ViewResponseComponent} from "./pages/doctor/patientinformation/video-request/view-response/view-response.component";
import { MessageComponent } from './pages/doctor/patientinformation/message/message.component';
import { PatientMessageComponent } from './pages/user/message/message.component';
import { ChatComponent } from './shared/components/chat/chat.component';
import {PhysicalAppearanceComponent} from "./pages/user/necessaryforms/physical-preferences/physical-appearance.component";
import {PrenatalFeaturesComponent} from "./pages/user/necessaryforms/prenatal-features/prenatal-features.component";
import {BirthFeaturesComponent} from "./pages/user/necessaryforms/birth-features/birth-features.component";
import {AfterBirthFeaturesComponent} from "./pages/user/necessaryforms/after-birth-features/after-birth-features.component";
import {AfterBirthCerebralPalsyReasonsComponent} from "./pages/user/necessaryforms/after-birth-cerebral-palsy-causes/after-birth-cerebral-palsy-reasons.component";
import {AppliedTreatmentsComponent} from "./pages/user/necessaryforms/applied-treatments/applied-treatments.component";
import {CoexistingDiseasesComponent} from "./pages/user/necessaryforms/coexisting-diseases/coexisting-diseases.component";
import {PhysiotherapyPastComponent} from "./pages/user/necessaryforms/physiotherapy-past/physiotherapy-past.component";
import {ExpectationsAboutProgramComponent} from "./pages/user/necessaryforms/expectations-about-program/expectations-about-program.component";
import { DoctorsCrudComponent } from './pages/admin/doctors-crud/doctors-crud.component';
import { NewAccountComponent } from './pages/admin/new-account/new-account.component';
import { AdminsCrudComponent } from './pages/admin/admins-crud/admins-crud.component';
import { NewAdminAccountComponent } from './pages/admin/admins-crud/new-admin-account/new-admin-account.component';
import { NewDoctorAccountComponent } from './pages/admin/doctors-crud/new-doctor-account/new-doctor-account.component';
import {AppliedSurgeryDataGridComponent} from "./pages/doctor/patientinformation/patient-gefd-information/applied-surgery-data-grid/applied-surgery-data-grid.component";
import {OrthesisInfoDataGridComponent} from "./pages/doctor/patientinformation/patient-gefd-information/orthesis-info-data-grid/orthesis-info-data-grid.component";
import {OtherOrthesisInfoDataGridComponent} from "./pages/doctor/patientinformation/patient-gefd-information/other-orthesis-info-data-grid/other-orthesis-info-data-grid.component";
import {JoinComponent} from "./pages/online-meeting/join.component";
import {MeetingListComponent} from "./pages/doctor/online-meeting/meeting-list.component";
import {OnlineMeetingBlockComponent} from "./shared/components/online-meeting-block/online-meeting-block.component";
import {MeetingsComponent} from "./pages/doctor/patientinformation/meetings/meetings.component";
import {DynamicFormComponent} from './pages/doctor/patientinformation/dynamic-form/dynamic-form.component';
import component from 'devextreme/core/component';
import {AssignFormComponent} from './pages/doctor/patientinformation/dynamic-form/assign-form/assign-form.component';
import {DefaultValueDataGridComponent} from './pages/doctor/patientinformation/dynamic-form/assign-form/default-value-data-grid/default-value-data-grid.component';
import {DynamicFormRequestComponent} from './pages/user/dynamic-form-request/dynamic-form-request.component';
import {AnswerDynamicFormComponent} from './pages/user/dynamic-form-request/answer-dynamic-form/answer-dynamic-form.component';
import {ViewDynamicFormComponent} from './pages/user/dynamic-form-request/view-dynamic-form/view-dynamic-form.component';
import {ViewFormComponent} from './pages/doctor/patientinformation/dynamic-form/view-form/view-form.component';
import {FormTemplatesComponent} from './pages/doctor/form-templates/form-templates.component';
import {CreateTemplateComponent} from './pages/doctor/form-templates/create-template/create-template.component';
import {ViewTemplateComponent} from './pages/doctor/form-templates/view-template/view-template.component';
import {DefaultValueDatagridComponent} from './pages/doctor/form-templates/create-template/default-value-datagrid/default-value-datagrid.component';
import {NewRegistredPatientComponent} from './pages/admin/new-registred-patient/new-registred-patient.component';
import { PatientsCrudComponent } from './pages/admin/patients-crud/patients-crud.component';
import { ResetPasswordComponent } from './shared/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import {ExerciseProgramsComponent} from './pages/doctor/patientinformation/exercise-programs/exercise-programs.component';
import {UserMeetingListComponent} from "./pages/user/online-meeting/user-meeting-list.component";
import {CreateExerciseProgramComponent} from "./pages/doctor/patientinformation/exercise-programs/create-exercise-program/create-exercise-program.component";
import {ExerciseFormModalComponent} from "./pages/doctor/patientinformation/exercise-programs/create-exercise-program/exercise-form-modal/exercise-form-modal.component";
import {ViewExerciseProgramsComponent} from "./shared/components/view-exercise-program/view-exercise-programs.component";
import {ViewExerciseListComponent} from "./shared/components/view-exercise-program/view-exercise-list/view-exercise-list.component";
import {PhysiotherapyProgramComponent} from "./pages/user/physiotherapy-program/physiotherapy-program.component";
import {SoruTemplatesComponent} from "./pages/doctor/soru-templates/soru-templates.component";
import {SoruViewTemplateComponent} from "./pages/doctor/soru-templates/soru-view-template/soru-view-template.component";
import {SoruCreateTemplateComponent} from "./pages/doctor/soru-templates/soru-create-template/soru-create-template.component";
import {SoruDefaultValueDatagridComponent} from "./pages/doctor/soru-templates/soru-create-template/soru-default-value-datagrid/soru-default-value-datagrid.component";




const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    data: { roles: [Role.User] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: UserHomeComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'task', component: UserTasksComponent },
      { path: 'general-evaluation-form', component: NecessaryFormsComponent },
      { path: 'user-notification', component: UserNotificationComponent },
      { path: 'user-video-submit', component: UserResponseVideoRequestComponent},
      { path: 'message', component: PatientMessageComponent},
      { path: 'dynamic-form-request', component: DynamicFormRequestComponent},
      { path: 'answer-dynamic-form/:formID', component: AnswerDynamicFormComponent},
      { path: 'view-dynamic-form/:formID', component: ViewDynamicFormComponent},
      { path: 'online-meeting',
        canActivate: [AuthGuard],
        data: { roles: [Role.User]},
        children: [
          { path: 'list', component: UserMeetingListComponent },
        ]
      },
      { path: 'physiotherapy-program', component: PhysiotherapyProgramComponent},
      { path: '**', component: NotfoundUserDoctorComponent }

    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AdminHomeComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'doctorscrud', component: DoctorsCrudComponent },
      { path: 'adminscrud', component: AdminsCrudComponent },
      { path: 'patientcrud', component: PatientsCrudComponent },
      { path: 'newregistredpatient', component: NewRegistredPatientComponent},
      { path: '**', component: NotfoundUserDoctorComponent }
    ]
  },
  {
    path: 'doctor',
    canActivate: [AuthGuard],
    data: { roles: [Role.Doctor] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DoctorHomeComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: 'task', component: DoctorTasksComponent },
      { path: 'exercises', component: DoctorExerciseManagmentComponent },
      { path: 'getall', component: ListPatientsComponent },
      //{ path: 'patient-info', component: PatientinformationComponent},
      //{ path: 'usergefd', component: PatientGefdInformationComponent },

      {
        path: 'patient-info/:tckimlikno', component: PatientinformationComponent,
        children: [
          { path: '', redirectTo: 'general-info', pathMatch: 'full' },
          { path: 'general-info', component: GeneralInformationComponent },
          { path: 'usergefd', component: PatientGefdInformationComponent },
          { path: 'video-request', component: VideoRequestComponent },
          { path: 'message', component: MessageComponent },
          { path: 'exercise-programs', component:ExerciseProgramsComponent},
          { path: 'dynamic-form', component: DynamicFormComponent},
          { path: 'assign-form', component: AssignFormComponent},
          { path: 'view-form/:formID', component: ViewFormComponent },
          { path: 'meetings', component: MeetingsComponent }
        ]
      },
      { path: 'form-templates', component: FormTemplatesComponent},
      { path: 'view-template/:formID', component: ViewTemplateComponent},
      { path: 'create-template', component: CreateTemplateComponent},
      { path: 'soru-templates', component: SoruTemplatesComponent},
      { path: 'soru-view-template/:soruID', component: SoruViewTemplateComponent},
      { path: 'soru-create-template', component: SoruCreateTemplateComponent},
      { path: 'online-meeting',
        canActivate: [AuthGuard],
        data: { roles: [Role.Doctor, Role.User]},
        children: [
          { path: 'list', component: MeetingListComponent }
        ]
      },
      { path: '**', component: NotfoundUserDoctorComponent }


    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: CreateAccountFormComponent },
  {path: 'forgotpassword', component: ForgotPasswordComponent},
  { path: 'reset_password/:token', component: ResetPasswordComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'online-meeting',
    canActivate: [AuthGuard],
    data: { roles: [Role.Doctor, Role.User]},
    children: [
      { path: 'join', component: JoinComponent },
    ]
  },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule, DxLoadIndicatorModule,
    FooterModule, SideNavOuterToolbarModule, CommonModule, BrowserModule, DxFileUploaderModule, DxProgressBarModule,
    DxAccordionModule, DxCheckBoxModule, DxSliderModule, DxTagBoxModule, DxTemplateModule, DxBoxModule,
    DxTextAreaModule, DxSelectBoxModule, DxNumberBoxModule, DxRadioGroupModule, DxSankeyModule,
    MDBBootstrapModule, WavesModule, DxButtonModule, DxToolbarModule, DxPopupModule, DxTabPanelModule, DxScrollViewModule, DxoItemDraggingModule, DxListModule, DxTooltipModule, DxTextBoxModule,
    DxDateBoxModule, DxSchedulerModule],

  exports: [RouterModule, DefaultValueDataGridComponent],
  declarations: [
    PagesComponent, DoctorCreateExerciseComponent, VideoPlayerComponent,AdminsCrudComponent,
    NewAccountComponent,NewDoctorAccountComponent,
    NewAdminAccountComponent,ForgotPasswordComponent,
    UserComponent, UserHomeComponent, UserProfileComponent, UserTasksComponent, NecessaryFormsComponent, UserNotificationComponent,
    PatientFormComponent, DemographicFeaturesComponent, ListPatientsComponent, PatientinformationComponent, GeneralInformationComponent,
    DoctorComponent, DoctorHomeComponent, DoctorProfileComponent, DoctorTasksComponent, DoctorExerciseManagmentComponent, PatientGefdInformationComponent,AdminComponent, AdminHomeComponent, AdminProfileComponent, AdminTasksComponent, ViewExerciseComponent, NotificationListComponent, ExerciseMediaCarouselComponent, VideoRequestComponent,UserResponseVideoRequestComponent,
     UserVideoSubmitPopupComponent, ViewResponseComponent, PhysicalAppearanceComponent, PrenatalFeaturesComponent,
    BirthFeaturesComponent, AfterBirthFeaturesComponent,AfterBirthCerebralPalsyReasonsComponent,AppliedTreatmentsComponent,CoexistingDiseasesComponent,
    PhysiotherapyPastComponent,ExpectationsAboutProgramComponent,MessageComponent,PatientMessageComponent,ChatComponent,DoctorsCrudComponent, AppliedSurgeryDataGridComponent,
    OrthesisInfoDataGridComponent, OtherOrthesisInfoDataGridComponent, AsynImageComponent,DynamicFormComponent,AssignFormComponent,DefaultValueDataGridComponent, DynamicFormRequestComponent,AnswerDynamicFormComponent,ViewDynamicFormComponent,ViewFormComponent,FormTemplatesComponent,ViewTemplateComponent,CreateTemplateComponent,DefaultValueDatagridComponent,
    NewRegistredPatientComponent,PatientsCrudComponent,ResetPasswordComponent, MeetingListComponent, JoinComponent, OnlineMeetingBlockComponent, MeetingsComponent,UserMeetingListComponent,ExerciseProgramsComponent,
    CreateExerciseProgramComponent, ExerciseFormModalComponent, ViewExerciseProgramsComponent, ViewExerciseListComponent, PhysiotherapyProgramComponent
  ]
})
export class AppRoutingModule { }
