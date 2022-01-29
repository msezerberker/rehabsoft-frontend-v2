import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { JwtInterceptor } from './security/jwt.interceptor';
import { AuthenticationService } from './security/authentication.service';
import { AuthGuard } from './security/auth.guard';
import { ErrorInterceptor } from './security/authentication.interceptor';
import {FooterComponent, FooterModule, HeaderComponent, LoginFormModule, UserPanelModule} from './shared/components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {ApiService} from './shared/services/api.service';
import {DevExtremeModule, DxDataGridModule, DxFormModule} from 'devextreme-angular';
import {SideNavInnerToolbarModule, SideNavOuterToolbarModule, SingleCardModule} from './layouts';
import {NotAuthorizedContainerModule} from './not-authorized-container';
import {AppInfoService, ScreenService} from './shared/services';
import {DxButtonModule} from "devextreme-angular";
import {PatientService} from "./shared/services/patient.service"
import {VideorequestService} from "./shared/services/videorequest.service"
import { DxSankeyModule } from "devextreme-angular";

import {DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';

import { CommonModule } from '@angular/common';
import {UserService} from "./shared/services/user.service";
import {ExerciseService} from "./shared/services/exercise.service";
import {AdminCrudService} from "./shared/services/admin-crud.service";

import {CookieService} from "ngx-cookie-service";
import {ResponseVideoRequestService} from "./shared/services/response-video-request.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {OnlineMeetingService} from "./shared/services/online-meeting.service";
import {DoctorService} from "./shared/services/doctor.service";
import {ScheduledExerciseService} from "./shared/services/scheduled-exercise.service";
import {FirebaseMessagingService} from "./shared/services/firebase-messaging.service";
import {AngularFireModule} from "@angular/fire";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFireMessagingModule} from "@angular/fire/messaging";
import { SoruTemplatesComponent } from './pages/doctor/soru-templates/soru-templates.component';
import { SoruCreateTemplateComponent } from './pages/doctor/soru-templates/soru-create-template/soru-create-template.component';
import { SoruViewTemplateComponent } from './pages/doctor/soru-templates/soru-view-template/soru-view-template.component';
import { SoruDefaultValueDatagridComponent } from './pages/doctor/soru-templates/soru-create-template/soru-default-value-datagrid/soru-default-value-datagrid.component';
import { DynamicSoruComponent } from './pages/doctor/patientinformation/dynamic-soru/dynamic-soru.component';
import { AssignSoruComponent } from './pages/doctor/patientinformation/dynamic-soru/assign-soru/assign-soru.component';
import { ViewSoruComponent } from './pages/doctor/patientinformation/dynamic-soru/view-soru/view-soru.component';
import { DefaultValueDataGridddComponent } from './pages/doctor/patientinformation/dynamic-soru/assign-soru/default-value-data-griddd/default-value-data-griddd.component';


@NgModule({
  declarations: [
    AppComponent,
    SoruTemplatesComponent,
    SoruCreateTemplateComponent,
    SoruViewTemplateComponent,
    SoruDefaultValueDatagridComponent,
    DynamicSoruComponent,
    AssignSoruComponent,
    ViewSoruComponent,
    DefaultValueDataGridddComponent
    ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DevExtremeModule,
    DxDataGridModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    NotAuthorizedContainerModule,
    DxButtonModule,
    UserPanelModule,
    BrowserModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTabPanelModule,
    BrowserModule,
    DxTabPanelModule,
    DxSankeyModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ApiService, AuthenticationService, AuthGuard, AppInfoService, ScreenService, UserService, ExerciseService, CookieService,PatientService,VideorequestService,
    ResponseVideoRequestService, AdminCrudService, OnlineMeetingService, DoctorService, ScheduledExerciseService, FirebaseMessagingService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, // giden her requeste JWT token'ını ekliyor dogrulama icin
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  entryComponents: [JwtInterceptor],
  bootstrap: [AppComponent]
})
export class AppModule { }

//platformBrowserDynamic().bootstrapModule(AppModule);
