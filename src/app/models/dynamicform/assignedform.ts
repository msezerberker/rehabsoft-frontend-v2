import {FormDynamic} from './formdynamic';
import {Patient} from '../patient';
import {FormAnswer} from './formanswer';

export class AssignedForm{
  id: number;
  formDynamic: FormDynamic;
  patient: Patient;
  isFormAnswered: boolean;
  formAnswersCollection: FormAnswer[];
  creationDate: any;
}
