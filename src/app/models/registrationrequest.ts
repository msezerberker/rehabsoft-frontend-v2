import {Patient} from './patient';

export class RegistrationRequest{
  username: string;
  password: string;
  firstName: string;
  surname:  string;
  email: string;
  confirmPassword: string;

  patient: Patient;
}
