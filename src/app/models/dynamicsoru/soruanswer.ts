import {AssignedSoru} from './assignedsoru';
import {SoruField} from './sorufield';

export class SoruAnswer {
  id: number;
  answer: string;
  assignedSoru: AssignedSoru;
  soruField: SoruField;
  creationDate: any;

}
