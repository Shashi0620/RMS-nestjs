/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import {AlertModule} from './components/_alert/alert.module'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router'
import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {EditAppComponent} from './edit-app/edit-app.component'
import {DndModule} from 'ngx-drag-drop'
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {AddTemplateComponent} from './components/add-template/add-template.component'
import {TemplateDetailsComponent} from './components/template-details/template-details.component'
import {TemplateListComponent} from './components/template-list/template-list.component'
import {EditFormComponent} from './edit-form/edit-form.component'
import {LoginComponent} from './login/login.component'
import {RegisterComponent} from './register/register.component'
import {AddFormComponent} from './components/add-form/add-forms.component'
import {EditFormsComponent} from './components/edit-forms/edit-forms.component'
import {MatSliderModule} from '@angular/material/slider'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatTableModule} from '@angular/material/table'
import {MatDialogModule} from '@angular/material/dialog'
import {RackListComponent} from './components/rack-list/rack-list.component'
import {EditRackComponent} from './components/edit-rack/edit-rack.component'
import {CreateRackComponent} from './components/create-rack/create-rack.component'
import {TrayModule} from './components/tray-crud/tray.module'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core'
import {MatMenuModule} from '@angular/material/menu'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {DatePipe} from '@angular/common'
import {MatPaginatorModule} from '@angular/material/paginator'
import {StaffCrudComponent} from './staff-crud/staff-crud.component'
import {AddStaffComponent} from './add-edit-staff/add-edit-staff.component'
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component'
import {UserProfileComponent} from './components/user-profile/user-profile.component'
import {ChangePasswordComponent} from './components/change-password/change-password.component'
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown'
import {NgSelectModule} from '@ng-select/ng-select'
import {FormListComponent} from './components/forms-list/forms-list.component'
import {AddEditStoreComponent} from './add-edit-store/add-edit-store.component'
import {StoreListingComponent} from './store-listing/store-listing.component'
// import {DashboardComponent} from './dashboard/dashboard.component'
import {AddMenuComponent} from '../app/dialog/add-translate.component'
import {NotificationListingComponent} from './notification-listing/notification-listing.component'
import {AddEditNotificationComponent} from './add-edit-notification/add-edit-notification.component'
import {LogService} from './services/log.service'
import {HeadersInterceptor} from './headers.interceptor'
import {TranslateComponent} from '../app/Translate.component'
import {OverlayModule} from '@angular/cdk/overlay'
import {ContactUsComponent} from './components/contact-us/contact-us.component'
import {DeviceDetectorService} from 'ngx-device-detector'
import {UniversalDeviceDetectorService} from './services/universal-device-detector.service'
import {TermsConditionComponent} from './components/terms-condition/terms-condition.component'
import {HelpModule} from './components/help-component/helpcomponent.module'
import {NotificationViewModule} from './components/notification-view-component/notification-view-component.module'
import {FaqComponent} from './components/faq-component/faq-component'
import {DashboardComponent} from './dashboard/dashboard.component'
import {GoogleMapsModule} from '@angular/google-maps'
import {MatCardModule} from '@angular/material/card'
import {UseCasesComponent} from './use-cases/use-cases.component'
const appRoutes: Routes = [
  // { path: '', component: EditAppComponent },
]
const apiKey = ''

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    AddMenuComponent,
    LoginComponent,
    TranslateComponent,
    RegisterComponent,
    EditAppComponent,
    AddTemplateComponent,
    TemplateDetailsComponent,
    TemplateListComponent,
    EditFormComponent,
    AddFormComponent,
    EditFormsComponent,
    FormListComponent,
    RackListComponent,
    EditRackComponent,
    CreateRackComponent,
    StaffCrudComponent,
    AddStaffComponent,
    ForgotPasswordComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    AddEditStoreComponent,
    StoreListingComponent,
    DashboardComponent,
    NotificationListingComponent,
    AddEditNotificationComponent,
    ContactUsComponent,
    TermsConditionComponent,
    FaqComponent,
    UseCasesComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    DndModule,
    MatSliderModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    TrayModule,
    HelpModule,
    NgSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    AlertModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    OverlayModule,
    NotificationViewModule,
    GoogleMapsModule
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    },
    LogService,
    {
      provide: DeviceDetectorService,
      useClass: UniversalDeviceDetectorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
