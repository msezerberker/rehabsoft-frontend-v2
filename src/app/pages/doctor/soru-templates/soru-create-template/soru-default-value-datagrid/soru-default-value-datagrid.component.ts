import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import notify from 'devextreme/ui/notify';
import {SoruFieldDefaultValue} from '../../../../../models/dynamicsoru/sorufielddefaultvalue';

@Component({
  selector: 'app-soru-default-value-datagrid',
  templateUrl: './soru-default-value-datagrid.component.html',
  styleUrls: ['./soru-default-value-datagrid.component.scss']
})
export class SoruDefaultValueDatagridComponent implements AfterViewInit {

  @Input()
  soruFieldDefaultValueMap: any;

  @Input()
  key: number;

  @Input()
  dataSource: SoruFieldDefaultValue[];
  defaultValue: SoruFieldDefaultValue;

  constructor(){
    this.defaultValue = new SoruFieldDefaultValue();
  }

  ngAfterViewInit() {
  }

  addMediaToList = (e) => {
    if(this.defaultValue.valueName === '' || this.defaultValue === null || this.defaultValue.valueName === undefined){
      notify("HATA: Lütfen seçenek ismini giriniz!!!", "error");
      return;
    }

    this.soruFieldDefaultValueMap[this.key].push(this.defaultValue);
    this.defaultValue = new SoruFieldDefaultValue();

  }

}
