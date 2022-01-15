import {Parent} from './parent';
import {User} from './user';

export class Patient {
  id: number;
  tcKimlikNo: string;
  address: string;
  parentCollection: Parent[];
  user: User;
}
