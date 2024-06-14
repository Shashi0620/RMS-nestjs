/* eslint-disable @typescript-eslint/no-extraneous-class */
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {NotificationViewComponent} from './notification-view-component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {OverlayModule} from '@angular/cdk/overlay'

@NgModule({
  declarations: [NotificationViewComponent],
  exports: [NotificationViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OverlayModule
  ]
})
export class NotificationViewModule {}
