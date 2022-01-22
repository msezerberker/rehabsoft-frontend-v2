import {SoruDynamic} from './sorudynamic';
import {Patient} from '../patient';
import {SoruAnswer} from './soruanswer';

export class AssignedSoru {
  id: number;
  soruDynamic: SoruDynamic;
  patient: Patient;
  isSoruAnswered: boolean;
  soruAnswersCollection: SoruAnswer[];
  creationDate: any;
}
