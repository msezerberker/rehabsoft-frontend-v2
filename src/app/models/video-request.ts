import {Patient} from "./patient";
import {Exercise} from "./exercise/exercise";
import { Doctor } from "./doctor";

export class VideoRequest {


    id: number;

    requestContent: string;

    requestTitle: string;

    doctor:Doctor;

    patient:Patient;

    exerciseCollection:Exercise[];

    responseVideoRequest:any;

    creationDate:any;

  }
