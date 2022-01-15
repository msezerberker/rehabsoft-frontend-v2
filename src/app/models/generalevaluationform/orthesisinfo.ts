export class OrthesisInfo{
  constructor(rightPart: boolean, leftPart: boolean, orthesisName: string){
    this.rightPart = rightPart;
    this.leftPart = leftPart;
    this.orthesisName = orthesisName;
  }
  id: number;
  rightPart: boolean;
  leftPart: boolean;
  orthesisName: string;
}
