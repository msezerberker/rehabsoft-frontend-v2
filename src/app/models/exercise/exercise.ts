import {User} from '../user';
import {ExerciseImage} from './exerciseimage';
import {ExerciseVideo} from './exercisevideo';

export class Exercise{
  id: number;
  exerciseName: string;
  exerciseContent: string;
  exerciseImageCollection: ExerciseImage[];
  exerciseVideoCollection: ExerciseVideo[];
  user: User;
}
