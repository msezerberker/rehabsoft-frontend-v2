import {AssignedForm} from './assignedform';
import {FormField} from './formfield';

export class FormAnswer{
  id:number;
  answer: string;
  assignedForm: AssignedForm;
  formField: FormField;
  creationDate: any;

}
