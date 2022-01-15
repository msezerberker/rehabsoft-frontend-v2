import { Component, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import {TokenDto} from '../../../models/tokendto';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  @Input()
  currentUser: TokenDto=new TokenDto();

  constructor() {
  }
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule
  ],
  declarations: [ UserPanelComponent ],
  exports: [ UserPanelComponent ]
})
export class UserPanelModule { }
