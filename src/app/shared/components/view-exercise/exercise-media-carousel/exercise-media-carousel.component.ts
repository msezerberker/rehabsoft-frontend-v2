import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import notify from "devextreme/ui/notify";
import {ExerciseVideo} from "../../../../models/exercise/exercisevideo";
import {ExerciseService} from "../../../services/exercise.service";

@Component({
  selector: 'app-exercise-media-carousel-component',
  templateUrl: 'exercise-media-carousel.component.html',
  styleUrls: ['./exercise-media-carousel.component.scss']
})

export class ExerciseMediaCarouselComponent implements OnInit{

  @ViewChild('mdbCarouselItem') mdbCarouselItem;

  isImage: boolean = true;

  @Input()
  dataSource:{
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

  }
}
