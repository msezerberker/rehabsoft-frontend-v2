import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import notify from 'devextreme/ui/notify';
import {ResponseVideoRequest} from "../../../../models/responsevideorequest/responsevideorequest";
import {ResponseVideoRequestService} from "../../../../shared/services/response-video-request.service";
import {Exercise} from "../../../../models/exercise/exercise";
import {ExerciseVideo} from "../../../../models/exercise/exercisevideo";
import {RequestedVideo} from "../../../../models/responsevideorequest/requestedvideo";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {DxFileUploaderComponent, DxFormComponent} from "devextreme-angular";

@Component({
  selector: 'app-user-video-submit-popup',
  templateUrl: 'user-video-submit-popup.component.html',
  styleUrls: [ './user-video-submit-popup.component.scss' ]
})

export class UserVideoSubmitPopupComponent {

  @ViewChild('dxFileUploaderComponent') fileUploaderComponent: DxFileUploaderComponent;
  @ViewChild('dxCreateResponseFormComponent') validationFormComponent: DxFormComponent;
  @Output() getAllResponseVideoRequest = new EventEmitter<void>();
  @Output() getAllVideoRequest = new EventEmitter<void>();
  videoRequestId:number;

  dataSource: ResponseVideoRequest;
  popUpTitle = "Video Ekle";
  isVisible:boolean;
  isEditPopUp:boolean;
  isLoading:boolean;

  filesVideoRequestList:{
    id:string,
    text:string,
    file: File,
    requestedVideo: RequestedVideo
  }[];

  fileForAddToList:{
    id:string,
    text:string,
    file: File,
    requestedVideo: RequestedVideo
  };

  submitExercise = (e: any) => {

    //validate from outside of form example
    if (! this.validationFormComponent.instance.validate().isValid) {
      return;
    }

    this.createRequestedVideoCollection();
    // console.log("fonk disi:, ", this.popUpContent.exerciseVideoCollection);

    this.isLoading = true
    // silinecek this.dataSource.responseContent = this.dataSource.responseContent.trim();
    if(this.isEditPopUp){ // if popup is opened to update exercise
      // this.responseVideoRequestService.update(this.popUpContent).subscribe(
      //   (res) => {
      //     this.isLoading = false;
      //     this.closePopUp();
      //     // @ts-ignore
      //     swal.fire({
      //       title: 'Başarılı !',
      //       icon: 'success',
      //       text: ' Egzersizi Başarılı Bir Şekilde Güncellendi! ',
      //       type: 'success',
      //       heightAuto: false
      //     }).then(() => {
      //       this.getAllResponseVideoRequest.next();
      //     });
      //   },
      //   err => {
      //     this.isLoading = false;
      //     console.log('err: ', err);
      //     if (err instanceof HttpErrorResponse) {
      //       // @ts-ignore
      //       swal.fire({
      //         title: 'Hata Oluştu !',
      //         text: 'Ekleme İşlemi Başarısız Oldu! ',
      //         type: 'error',
      //         heightAuto: false
      //       });
      //     } else{
      //       // @ts-ignore
      //       swal.fire({
      //         title: 'Hata Oluştu !',
      //         text: 'Ekleme İşlemi Başarısız Oldu! ',
      //         icon: 'error',
      //         heightAuto: false
      //       });
      //     }
      //   }
      // );
    } else{ // if popup is opened to create exercise
      this.responseVideoRequestService.postResponseVideoRequest(this.dataSource, this.videoRequestId).subscribe(
        (res) => {
          this.isLoading = false;
          this.closePopUp();
          // @ts-ignore
          swal.fire({
            title: 'Başarılı !',
            icon: 'success',
            text: ' Cevap Başarılı Bir Şekilde Eklendi! ',
            type: 'success',
            heightAuto: false
          }).then(() => {
            console.log("cevap calisti");
            this.getAllVideoRequest.next();
            // this.getAllResponseVideoRequest.next();
          });
        },
        err => {
          this.isLoading = false;
          console.log('err: ', err);
          if (err instanceof HttpErrorResponse) {
            // @ts-ignore
            swal.fire({
              title: 'Hata Oluştu !',
              text: 'Ekleme İşlemi Başarısız Oldu! ',
              type: 'error',
              heightAuto: false
            });
          }else{
            // @ts-ignore
            swal.fire({
              title: 'Hata Oluştu !',
              text: 'Ekleme İşlemi Başarısız Oldu! ',
              icon: 'error',
              heightAuto: false
            });
          }
        }
      );
    }

///notify({ message: error, width: 300, shading: false }, "error", 1500);
  }
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


  constructor(private responseVideoRequestService: ResponseVideoRequestService) {
  }

  ngOnInit(): void {
    this.getItemsList();
  }

  getItemsList = ()=>{
  }

  openPopUpForCreate = (videoRequestId)=>{
    console.log("this.dataSource",this.dataSource);
    this.dataSource = new ResponseVideoRequest();
    this.filesVideoRequestList = [];
    this.fileForAddToList={
      id:'',
      text:'',
      file: null,
      requestedVideo: null
    };
    this.popUpTitle = 'Video Ekle';
    this.isVisible = true;
    this.isEditPopUp = false;
    this.videoRequestId = videoRequestId;
  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

  addMediaToList = (e) => {
    // stop here if form is invalid
    // if (!e.validationGroup.validate().isValid) {
    //   return;
    // }
    if(this.fileForAddToList.file === undefined ){
      console.log("file undefined");
      return;
    }
    if(this.fileForAddToList.file === null ){
      console.log("file null");
      return;
    }

    if (!this.isFileTypeAndSizeValid(this.fileForAddToList.file) || this.fileForAddToList.file === null) {
      console.log("file fileTypeAndSize not Valid");
      return;
    }
    this.filesVideoRequestList.push(this.fileForAddToList);
    this.fileForAddToList={
      id:'',
      text:'',
      file: null,
      requestedVideo: null
    }
    this.fileUploaderComponent.instance.reset();
  }

  isFileTypeAndSizeValid = (file:any):boolean =>{
    // first number is in GB
    return (file.type.startsWith('image/') || file.type.startsWith('video/')) && file.size < 1*1000*1024*1024;
  }
  allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png',
    '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv',
    '.ogg', '.mp4', '.m4p', '.m4v',
    '.avi','.wmv','.mov', '.qt','.flv', '.swf', '.avchd','.webm'];

  uploadMediaToAdd = (event) => {
    let now = new Date();

    let timestamp = now.getFullYear().toString(); // year
    timestamp += (now.getMonth() < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += ((now.getDate() < 10) ? '0' : '') + now.getDate().toString(); // pad with a 0
    timestamp += ((now.getHours() < 10) ? '0' : '') + now.getHours().toString(); // pad with a 0
    timestamp += ((now.getMinutes() < 10) ? '0' : '') + now.getMinutes().toString(); // pad with a 0
    timestamp += ((now.getSeconds() < 10) ? '0' : '') + now.getSeconds().toString(); // pad with a 0
    timestamp += ((now.getMilliseconds() < 10) ? '0' : '') + now.getMilliseconds().toString(); // pad with a 0

    this.fileForAddToList.id = timestamp;
    console.log(event);
    this.fileForAddToList.file = event.value[0];
  }

  private createRequestedVideoCollection = () => {
    this.dataSource.requestedVideoCollection = [];
    console.log("this.filesVideoRequestList",this.filesVideoRequestList);
    this.filesVideoRequestList.forEach((file, index)=>{
      let tempRequestedVideo = new RequestedVideo();
      tempRequestedVideo.id = (file.requestedVideo===null)?null:file.requestedVideo.id;
      tempRequestedVideo.videoFile = file.file;
      this.dataSource.requestedVideoCollection.push(tempRequestedVideo);
    });
    console.log("fonk ici requestedVideoCollection olustu:, ", this.dataSource.requestedVideoCollection);
  }
}
