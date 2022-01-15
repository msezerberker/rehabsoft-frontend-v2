import {Notification} from './notification';

export class User {
    id: number; //sil
    firstName: string;
    surname: string;
    email: string; //sil,
    notificationCollection: Notification[]
}
