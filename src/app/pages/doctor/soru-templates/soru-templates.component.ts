import {Component, OnInit} from '@angular/core';
import {TokenDto} from '../../../models/tokendto';
import {AuthenticationService} from '../../../security/authentication.service';
import {SoruDynamicService} from '../../../shared/services/sorudynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SoruTemplate} from '../../../models/dynamicsoru/sorutemplate';
import notify from 'devextreme/ui/notify';
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-soru-templates',
  templateUrl: './soru-templates.component.html',
  styleUrls: ['./soru-templates.component.scss']
})
export class SoruTemplatesComponent implements OnInit {

  username: string;
  currentUser: TokenDto;
  soruTemplateList: SoruTemplate[];

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
                if (err.status === 500) {
                  // @ts-ignore
                  swal.fire({
                    title: 'Hata Oluştu !',
                    text: 'Hastaya atanmış soru silinemez! ',
                    type: 'error',
                    heightAuto: true
                  });
                  // this.router.navigate(['/login']);
                }
              }
            });
        }
      });

  }

}
