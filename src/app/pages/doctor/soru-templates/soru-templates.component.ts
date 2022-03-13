import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenDto} from '../../../models/tokendto';
import {AuthenticationService} from '../../../security/authentication.service';
import {SoruDynamicService} from '../../../shared/services/sorudynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SoruTemplate} from '../../../models/dynamicsoru/sorutemplate';
import notify from 'devextreme/ui/notify';
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {SoruCreateTemplateComponent} from "./soru-create-template/soru-create-template.component";
import {SoruDynamic} from "../../../models/dynamicsoru/sorudynamic";


@Component({
  selector: 'app-soru-templates',
  templateUrl: './soru-templates.component.html',
  styleUrls: ['./soru-templates.component.scss']
})
export class SoruTemplatesComponent implements OnInit {

   @ViewChild(SoruCreateTemplateComponent) soruCreateTemplateComponent: SoruCreateTemplateComponent;

  isEditPopUp = false;
  isVisible: boolean;
  popUpContent: SoruDynamic;
  isLoading: boolean;

  popUpTitle = '';

  username: string;
  currentUser: TokenDto;
  soruTemplateList: SoruTemplate[];

  cancelExercise = (Event) => {
    this.closePopUp();
  }


  cancelButtonOption = {
    text: 'Vazgeç',
    onClick: (e)=>this.cancelExercise(e),
    width: '130px',
    type: 'outlined',
  }
  submitButtonOption = {
    text: 'Kaydet',
    onClick: (e)=>this.submitExercise(e),
    width: '130px',
    type: 'default',
    icon:'fas fa-save',
  }

  // tslint:disable-next-line:max-line-length
  constructor(private authenticationService: AuthenticationService, private dynamicSoruService: SoruDynamicService, private router: Router, route: ActivatedRoute) {
    this.soruTemplateList = [];
    authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
    this.getAllTemplates();
  }

  getAllTemplates = () => {
    this.dynamicSoruService.getAllTemplates(this.username).subscribe(
      (data) => {
        //console.log("Service data:", data);
        this.soruTemplateList = data;
        console.log('Hastaya atanan soru-cevaplar ', this.dynamicSoruService);
      },
      (error) => {
        notify(error);
      }
    );
  }

  btnClick = function () {
    let urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(urlArray.join('/') + '/soru-create-template');
  };

  viewSoru = (event) => {
    let urlArray = this.router.url.split('/');
    urlArray.pop();
    this.router.navigateByUrl(urlArray.join('/') + '/soru-view-template/' + event.row.data.id);
  }

  delIconClick = (event) => {
    // confirm(+' '+ 'silinsin mi?', 'Emin misiniz?')
    //   .then((dialogResult) => {
    //   alert(dialogResult ? "Silindi" : "İptal edildi", "Başarılı");
    // });

    // @ts-ignore
    swal.fire({
      title: 'Emin misiniz?',
      text: 'Soru kalıcı olarak silinecektir!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      heightAuto: false
    })
      .then((result) => {
        if (result.value) {

          this.dynamicSoruService.deleteById(event.row.data.id).subscribe((res) => {
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
              console.log('err: ', err.status);
                // @ts-ignore
              swal.fire({
                  title: 'Hata Oluştu !',
                  text: 'Hastaya atanmış soru silinemez! ',
                  type: 'error',
                  heightAuto: false
                }).then(() => {
                  this.ngOnInit();
                });
                // this.router.navigate(['/login']);

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

  editIconClick = (e: any) => {
     this.soruCreateTemplateComponent.openPopUpForEdit(e.row.data);
    this.popUpContent = {...e.row.data["soruDynamic"]};
    this.popUpTitle = 'Soru Düzenleme';
    this.isVisible = true;
    this.isEditPopUp = true;
    console.log(this.popUpContent.id);
  }

  submitExercise = (e: any) => {
    this.isLoading = true;
    // this.popUpContent.soruFieldCollection = this.popUpContent.soruFieldCollection.trim();
    console.log(e)
    if (this.isEditPopUp){ // if popup is opened to update exercise
      this.dynamicSoruService.update(this.popUpContent).subscribe(
        (res) => {
          this.isLoading = false;
          this.closePopUp();
          // @ts-ignore
          swal.fire({
            title: 'Başarılı !',
            icon: 'success',
            text: ' Soru Başarılı Bir Şekilde Güncellendi! ',
            type: 'success',
            heightAuto: false
          }).then(() => {
            this.ngOnInit();
          });
        },
        err => {
          this.isLoading = false;
          console.log('err: ', err);
          if (err instanceof HttpErrorResponse) {
            // @ts-ignore
            swal.fire({
              title: 'Hata Oluştu !',
              text: 'Güncelleme İşlemi Başarısız Oldu! ',
              type: 'error',
              heightAuto: false
            });
          } else{
            // @ts-ignore
            swal.fire({
              title: 'Hata Oluştu !',
              text: 'Güncelleme İşlemi Başarısız Oldu! ',
              icon: 'error',
              heightAuto: false
            });
          }
        }
      );
    }
  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

}
