import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import notify from "devextreme/ui/notify";
import {ExerciseService} from "../../services/exercise.service";
import {Exercise} from "../../../models/exercise/exercise";
import {ExerciseVideo} from "../../../models/exercise/exercisevideo";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-view-exercise-component',
  templateUrl: 'view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})

export class ViewExerciseComponent implements OnInit, OnDestroy{

  stylingMode:string = "filled";
  isVisible: boolean;
  popUpContent:any;
  exercise:Exercise;
  exerciseVideoListPrepared:{
    id: number;
    title: string;
    videoUrl: string;
    videoFile: File;
    isImage: boolean;
    videoRequestUrl:string;
  }[];
  title:any;

  constructor(private exerciseService: ExerciseService ) {
  }

  ngOnInit(): void {
      console.log("VIEW EXERCISE CANLANDI!!");
  }

  openPopUp = (exercise: Exercise)=>{
    this.exercise = exercise;
    this.title = "Egzersiz - "+exercise.exerciseName;
    this.isVisible = true;

    this.prepareExerciseVideoForRequest(exercise);
  }
  prepareExerciseVideoForRequest = (exercise: Exercise) => {
    let exerciseVideoListPrepared:any = [...exercise.exerciseVideoCollection];
    exerciseVideoListPrepared.sort((a,b) => (a.title.split('-')[0] > b.title.split('-')[0] ) ? 1 : ((b.title.split('-')[0] > a.title.split('-')[0] ) ? -1 : 0));

    exerciseVideoListPrepared.forEach(exerciseVideo =>{
      if(this.checkIsImage(exerciseVideo)){
        console.log("image exercise url:",);
        exerciseVideo["videoRequestUrl"] = `${environment.API_BASE_PATH}/exercises/getimage/${exerciseVideo.id}`;
        exerciseVideo["isImage"] = true;
      } else{
        let fileType = exerciseVideo.videoUrl.split(".").pop();
        exerciseVideo["videoRequestUrl"] = `${environment.API_BASE_PATH}/video/stream/${fileType}/${exerciseVideo.id}`;
        exerciseVideo["isImage"] = false;
      }
    });

    this.exerciseVideoListPrepared = exerciseVideoListPrepared;
  }

  checkIsImage= (exerciseVideo:ExerciseVideo):boolean => {
    let isImage = false;
    let fileExtensionOfExerciseVideo = exerciseVideo.videoUrl.split(".").pop();
    if(this.imageFileExtensions.includes(fileExtensionOfExerciseVideo)){
      isImage = true;
    }
    return isImage;
  }
  imageFileExtensions = ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi',
    'png', 'gif', 'webp', 'tiff','tif','psd','raw','arw','cr2','nrw','k25',
    'bmp','dib','heif','heic','ind','indd','indt','jp2','j2k','jpf','jpx','jpm',
    'mj2','svg','svgz','ai','eps','pdf'
    ];
  videoFileExtensions = ['mpg', 'mp2', 'mpeg', 'mpe', 'mpv',
    'ogg', 'mp4', 'm4p', 'm4v',
    'avi','wmv','mov', 'qt','flv', 'swf', 'avchd','webm'];

  ngOnDestroy(): void {
    console.log("VIEW EXERCISE oluyorr!!");
  }

  closePopUp() {
    this.isVisible = false;
  }
}
