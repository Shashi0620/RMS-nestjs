/* eslint-disable @typescript-eslint/no-extraneous-class */
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {TrayComponent} from './tray.component'
import {KtdGridModule} from '@katoid/angular-grid-layout'
import {MatButtonModule} from '@angular/material/button'
import {MatSelectModule} from '@angular/material/select'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatInputModule} from '@angular/material/input'
import {MatChipsModule} from '@angular/material/chips'
import {MatTableModule} from '@angular/material/table'
import {MatMenuModule} from '@angular/material/menu'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ColorSketchModule} from 'ngx-color/sketch'
import {UploadFilesComponent} from '../upload-files/upload-files.component'
import {ItemListingComponent} from '../item-crud/item-listing.component'
import {FormlistQuantityComponent} from '../../formlist-quantity/formlist-quantity.component'
import {MatPaginatorModule} from '@angular/material/paginator'
import {NgSelectModule} from '@ng-select/ng-select'
import {HelpModule} from '../help-component/helpcomponent.module'

@NgModule({
  declarations: [
    TrayComponent,
    UploadFilesComponent,
    ItemListingComponent,
    FormlistQuantityComponent
  ],
  exports: [TrayComponent],
  imports: [
    CommonModule,
    FormsModule,
    HelpModule,
    ReactiveFormsModule,
    KtdGridModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatChipsModule,
    ColorSketchModule,
    MatTableModule,
    MatMenuModule,
    NgSelectModule,
    MatSlideToggleModule,
    MatPaginatorModule
  ]
})
export class TrayModule {}
