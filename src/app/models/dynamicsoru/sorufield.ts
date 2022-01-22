import {SoruDynamic} from './sorudynamic';
import {SoruFieldDefaultValue} from './sorufielddefaultvalue';

export class SoruField {
  id: number;
  fieldName: string;
  fieldType: string;
  fieldOrder: number;
  soruFieldDefaultValueCollection: SoruFieldDefaultValue[];

  // Its just used for front end purpose
  key:string;
}
