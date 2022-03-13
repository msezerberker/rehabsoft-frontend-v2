import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TokenDto} from '../../../../models/tokendto';
import {SoruDynamicService} from '../../../../shared/services/sorudynamic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../../../shared/services/patient.service';
import {AuthenticationService} from '../../../../security/authentication.service';
import notify from 'devextreme/ui/notify';
import {first} from 'rxjs/operators';
import {SoruField} from '../../../../models/dynamicsoru/sorufield';
import {SoruTemplate} from '../../../../models/dynamicsoru/sorutemplate';
import {SoruDynamic} from '../../../../models/dynamicsoru/sorudynamic';
import {SoruFieldDefaultValue} from '../../../../models/dynamicsoru/sorufielddefaultvalue';
import {FormFieldDefaultValue} from '../../../../models/dynamicform/formfielddefaultvalue';
import {Exercise} from '../../../../models/exercise/exercise';
import {ExerciseVideo} from '../../../../models/exercise/exercisevideo';
import swal from 'sweetalert2';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-soru-create-template',
  templateUrl: './soru-create-template.component.html',
  styleUrls: ['./soru-create-template.component.scss']
})
export class SoruCreateTemplateComponent implements OnInit {

  isEditPopUp = false;
  isVisible: boolean;
  popUpContent: SoruDynamic;
  isLoading: boolean;

  popUpTitle = '';

  dataSource: SoruField[];
  formFieldDefaultValueMap: any = new Map();
  soruFieldSelectBoxElements: string[];
  showDragIcons: boolean;
  soruTitle: string;
  soruExplanation: string;
  soruTemplate: SoruTemplate;
  private loading: boolean;
  private error: any;
  username: string;
  currentUser: TokenDto;

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

  constructor(private dynamicSoruService: SoruDynamicService, private router: Router, route: ActivatedRoute, private patientService: PatientService, private authenticationService: AuthenticationService) {

    this.dataSource = [];
    this.showDragIcons = true;
    this.soruFieldSelectBoxElements = ['METIN', 'SAYISAL', 'EVET_HAYIR', 'SECMELI', 'COKLU_SECMELI'];
    this.soruTitle = '';
    this.soruExplanation = '';
    this.formFieldDefaultValueMap = new Map();
    this.soruTemplate = new SoruTemplate();
    this.soruTemplate.soruDynamic = new SoruDynamic();

    authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    });
  }

  ngOnInit(): void {
  }

  btnClick = () => {
    if (this.soruTitle == '' || this.soruTitle == null || this.soruExplanation == '' || this.soruExplanation == null) {
      notify('HATA: Soru başlığı ve açıklaması boş bırakılamaz!!!', 'error');
      return;
    }

    if (this.dataSource.length == 0) {
      notify('HATA: Soruyu gönderebilmek için en az bir soru eklemelisiniz!!!', 'error');
      return;
    }

    let i = 1;
    for (const field of this.dataSource) {
      if (field.fieldType == 'SECMELI' || field.fieldType == 'COKLU_SECMELI') {
        if (this.formFieldDefaultValueMap[field.key].length < 1 || this.formFieldDefaultValueMap[field.key] === undefined) {
          notify('HATA: SECMELI ve COKLU_SECMELI soru tiplerinin şıkları boş bırakılamaz!!!', 'error');
          return;
        } else {
          field.soruFieldDefaultValueCollection = this.formFieldDefaultValueMap[field.key];
        }
      }
      field.fieldOrder = i;
      i = i + 1;
    }

    this.soruTemplate.soruDynamic.soruFieldCollection = this.dataSource;
    this.soruTemplate.soruDynamic.explanation = this.soruExplanation;
    this.soruTemplate.soruDynamic.title = this.soruTitle;


    console.log(this.soruTemplate);

    this.dynamicSoruService.addTemplate(this.soruTemplate, this.currentUser.username)
      .pipe(first())
      .subscribe(
        data => {
          // message is ok
          notify(JSON.stringify(data.responseMessage));
          // this.router.onSameUrlNavigation = 'reload';
          const urlArray = this.router.url.split('/');
          urlArray.pop();
          this.router.navigateByUrl(urlArray.join('/') + '/soru-templates');

        },
        error => {
          notify(JSON.stringify(error.responseMessage));
          this.error = error;
          this.loading = false;
        });

  }

  isEnabled(event): boolean {
    let result;
    this.dataSource.forEach(function(field) {
      if (field.key == event) {
        result = field.fieldType;
      }
    });
    return result == 'SECMELI' || result == 'COKLU_SECMELI';
  }

  onReorder = (e) => {
    const visibleRows = e.component.getVisibleRows(),
      toIndex = this.dataSource.indexOf(visibleRows[e.toIndex].data),
      fromIndex = this.dataSource.indexOf(e.itemData);

    this.dataSource.splice(fromIndex, 1);
    this.dataSource.splice(toIndex, 0, e.itemData);
  }

  onInitNewRow = (event) => {
    event.data.key = new Date().valueOf().toString();
    this.formFieldDefaultValueMap[event.data.key] = Array<FormFieldDefaultValue>();
  }

  submit = () => {
    delete this.dataSource[0].key;
  }

  openPopUpForEdit = (data) => {
    this.popUpContent = {...data};
    delete this.popUpContent["creatorNameSurname"];
    this.popUpTitle = 'Soru Düzenleme';
    this.isVisible = true;
    this.isEditPopUp = true;
  }

  submitExercise = (e: any) => {

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
