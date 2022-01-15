
import {Component, Input, OnInit} from '@angular/core';
import {OrthesisInfo} from "../../../../../models/generalevaluationform/orthesisinfo";

@Component({
  selector: 'app-orthesis-info-data-grid',
  templateUrl: './orthesis-info-data-grid.component.html',
  styleUrls: ['./orthesis-info-data-grid.component.scss']
})
export class OrthesisInfoDataGridComponent implements OnInit {

  @Input()
  orthesisInfoCollection:OrthesisInfo[];
  error = '';

  title:string;

  constructor() {

  }

  ngOnInit() {
  }

}
