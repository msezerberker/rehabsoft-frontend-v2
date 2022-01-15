import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Exercise} from "../../../../models/exercise/exercise";
import {ExerciseService} from "../../../../shared/services/exercise.service";
import notify from "devextreme/ui/notify";
import {ExerciseImage} from "../../../../models/exercise/exerciseimage";
import {ExerciseVideo} from "../../../../models/exercise/exercisevideo";
import {User} from "../../../../models/user";
import {DxFileUploaderComponent, DxFormComponent, DxValidationGroupComponent} from "devextreme-angular";
import {Role} from "../../../../models/role";
import swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-createexercise-component',
  templateUrl: 'doctor-createexercise.component.html',
  styleUrls: ['./doctor-createexercise.component.scss']
})

export class DoctorCreateExerciseComponent implements OnInit{

  @ViewChild('dxCreateExerciseFormComponent') validationFormComponent: DxFormComponent
  @ViewChild('dxFileUploaderComponent') fileUploaderComponent: DxFileUploaderComponent
  @Output() getAllExercise = new EventEmitter<void>();

  isEditPopUp:boolean=false;
  isVisible: boolean;
  popUpContent: Exercise;
  isLoading: boolean;

  popUpTitle:string = '';

  submitExercise = (e: any) => {

    //validate from outside of form example
    if (! this.validationFormComponent.instance.validate().isValid) {
      return;
    }

    this.createExerciseMediaCollection();
    console.log("fonk disi:, ", this.popUpContent.exerciseVideoCollection);

    this.isLoading = true
    this.popUpContent.exerciseName = this.popUpContent.exerciseName.trim();
    this.popUpContent.exerciseContent = this.popUpContent.exerciseContent.trim();
    if(this.isEditPopUp){ // if popup is opened to update exercise
      this.exerciseService.update(this.popUpContent).subscribe(
        (res) => {
          this.isLoading = false;
          this.closePopUp();
          // @ts-ignore
          swal.fire({
            title: 'Başarılı !',
            icon: 'success',
            text: this.popUpContent.exerciseName+ ' Egzersizi Başarılı Bir Şekilde Güncellendi! ',
            type: 'success',
            heightAuto: false
          }).then(() => {
            this.getAllExercise.next();
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
          } else{
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
    } else{ // if popup is opened to create exercise
      this.exerciseService.save(this.popUpContent).subscribe(
        (res) => {
          this.isLoading = false;
          this.closePopUp();
          // @ts-ignore
          swal.fire({
            title: 'Başarılı !',
            icon: 'success',
            text: this.popUpContent.exerciseName+ ' Egzersizi Başarılı Bir Şekilde Eklendi! ',
            type: 'success',
            heightAuto: false
          }).then(() => {
            this.getAllExercise.next();
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

  createExerciseMediaCollection = () => {
    this.popUpContent.exerciseVideoCollection = [];
    console.log("this.filesExercise",this.filesExerciseList);
    this.filesExerciseList.forEach((file, index)=>{
      let tempExerciseVideo = new ExerciseVideo();
      tempExerciseVideo.id = (file.exerciseVideo===null)?null:file.exerciseVideo.id;
      tempExerciseVideo.title = JSON.stringify(index) + '-' + file.text.trim();
      tempExerciseVideo.videoFile = file.file;
      this.popUpContent.exerciseVideoCollection.push(tempExerciseVideo);
    });
    console.log("fonk ici:, ", this.popUpContent.exerciseVideoCollection);
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

  constructor(private exerciseService: ExerciseService ) {

  }

  ngOnInit(): void {

  }

  ///************ Exercise Media start ************///
  filesExerciseList:{
    id:string,
    text:string,
    file: File,
    exerciseVideo: ExerciseVideo
  }[];
  fileForAddToList:{
    id:string,
    text:string,
    file: File,
    exerciseVideo: ExerciseVideo
  };

  addMediaToList = (e) => {
    // stop here if form is invalid
    if (!e.validationGroup.validate().isValid) {
      return;
    }
    if(this.fileForAddToList.file === undefined ){
      return;
    }
    if(this.fileForAddToList.file === null ){
      return;
    }

    if (!this.isFileTypeAndSizeValid(this.fileForAddToList.file) || this.fileForAddToList.text === '' || this.fileForAddToList.file === null) {
      return;
    }
    this.filesExerciseList.push(this.fileForAddToList);
    this.fileForAddToList={
      id:'',
      text:'',
      file: null,
      exerciseVideo: null
    }
    this.fileUploaderComponent.instance.reset();
  }
  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  isFileTypeAndSizeValid = (file:any):boolean =>{
    // first number is in GB
    return (file.type.startsWith('image/') || file.type.startsWith('video/')) && file.size < 1*1000*1024*1024;
  }
  allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png',
  '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv',
  '.ogg', '.mp4', '.m4p', '.m4v',
  '.avi','.wmv','.mov', '.qt','.flv', '.swf', '.avchd','.webm']

  onAdd(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

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

  ///************ Exercise Media end ************///

  openPopUpForEdit = (data)=>{
    this.popUpContent = {...data};
    delete this.popUpContent["creatorNameSurname"];
    this.popUpTitle = 'Egzersiz Düzenleme';

    this.fillFilesExerciseListToEdit();
    this.fileForAddToList = {
      id:'',
      text:'',
      file: null,
      exerciseVideo: null
    };
    this.isVisible = true;
    this.isEditPopUp = true;
  }

  fillFilesExerciseListToEdit = () =>{
    this.filesExerciseList = [];
    this.popUpContent.exerciseVideoCollection.sort((a,b) => (a.title.split('-')[0] > b.title.split('-')[0] ) ? 1 : ((b.title.split('-')[0] > a.title.split('-')[0] ) ? -1 : 0));
    this.popUpContent.exerciseVideoCollection.forEach(exerciseVideo=>{
      let splittedVideoTitle:string[] = exerciseVideo.title.split('-');
      console.log("splittedVideoTitle: ",splittedVideoTitle);
      splittedVideoTitle.splice(0, 1);;
      console.log("splittedVideoTitle after shift: ",splittedVideoTitle);
      let splicedTitle='';
      splittedVideoTitle.forEach((word,index)=>{
        if(splittedVideoTitle.length===1){
          splicedTitle +=word;
        }else{
          if(index === 0){
            splicedTitle +=word;
          } else{
            splicedTitle +='-'+word;
          }
        }
      });
      this.filesExerciseList.push({
        id:exerciseVideo.id.toString(),
        text:splicedTitle,
        file: null,
        exerciseVideo: exerciseVideo
      });
    });
  }

  openPopUpForCreate = ()=>{
    this.popUpContent = new Exercise();
    this.filesExerciseList = [];
    this.fileForAddToList={
      id:'',
      text:'',
      file: null,
      exerciseVideo: null
    }
    this.popUpTitle = 'Egzersiz Oluşturma';
    this.isVisible = true;
    this.isEditPopUp = false;
  }

  closePopUp = ()=>{
    this.isVisible = false;
  }

}
