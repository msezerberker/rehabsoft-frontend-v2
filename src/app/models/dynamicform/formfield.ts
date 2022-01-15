import {FormDynamic} from './formdynamic';
import {FormFieldDefaultValue} from './formfielddefaultvalue';

export class FormField{
  id: number;
  fieldName: string;
  fieldType: string;
  fieldOrder: number;
  formFieldDefaultValueCollection: FormFieldDefaultValue[];

  // Its just used for front end purpose
  key:string;
}
