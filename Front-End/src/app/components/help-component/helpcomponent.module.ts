/* eslint-disable @typescript-eslint/no-extraneous-class */
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {HelpComponent} from './help.component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {OverlayModule} from '@angular/cdk/overlay'

@NgModule({
  declarations: [HelpComponent],
  exports: [HelpComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OverlayModule
  ]
})
export class HelpModule {}
