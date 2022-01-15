import {EventEmitter, Injectable} from "@angular/core";
import {Patient} from "../../models/patient";
import {Exercise} from "../../models/exercise/exercise";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "../../security/authentication.service";
import {User} from "../../models/user";
import {environment} from "../../../environments/environment";
import {AppliedSurgery} from "../../models/generalevaluationform/appliedsurgery";
import {ExerciseVideo} from "../../models/exercise/exercisevideo";
import {stringify} from "@angular/compiler/src/util";

@Injectable({ providedIn: 'root' })
export class ExerciseService {

  // exerciseList: EventEmitter<Exercise> = new EventEmitter();

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {

  }

  getAll() {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    //   withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    // };

    return this.http.get<Exercise[]>(`${environment.API_BASE_PATH}/exercises/all`);
  }

  deleteById(id:number) {
    return this.http.delete<string>(`${environment.API_BASE_PATH}/exercises/delete/${id}`);
  }

  getById(id:number){
    return this.http.get<Exercise>(`${environment.API_BASE_PATH}/exercises/get/${id}`);
  }
  save(exercise:Exercise){
    const payload = new FormData();
    this.appendExerciseMediaToExerciseWithOrder(exercise.exerciseVideoCollection, payload);
    payload.append('model', JSON.stringify(exercise));
    return this.http.post<Exercise>(`${environment.API_BASE_PATH}/exercises/create`,payload );
  }
  update(exercise:Exercise){
    const payload = new FormData();
    this.appendExerciseMediaToExerciseWithOrder(exercise.exerciseVideoCollection, payload);
    payload.append('model', JSON.stringify(exercise));
    return this.http.post<Exercise>(`${environment.API_BASE_PATH}/exercises/update`,payload );
  }

  getExerciseImageById(path:string){
    return this.http.post<Blob>(`${environment.API_BASE_PATH}/exercises/getimage`,path);
  }


  private appendExerciseMediaToExerciseWithOrder = (exerciseVideos: ExerciseVideo[], payload: FormData) =>{
    if(exerciseVideos !== null ){
      if(exerciseVideos.length>0){
        exerciseVideos.forEach((exerciseVideo,index)=>{
          if( !this.checkIsEmpty(exerciseVideo.videoFile) ){
            console.log("eklemeden once name: ", exerciseVideo.videoFile);
            payload.append('exerciseMediaList', new Blob([exerciseVideo.videoFile]), exerciseVideo.title+'.'+exerciseVideo.videoFile.name.split('.').pop());
          }
          delete exerciseVideo.videoFile;
        });
      }
    }
  }

  private checkIsEmpty = (object: any) =>{
    if(object === undefined ){
      return true;
    }
    return object === null;
  }





}
