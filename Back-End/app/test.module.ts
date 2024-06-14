import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import userPrefernceControllers from './controller/userpreference.controller'
import { UserPreferenceService } from './service/userpreference.service'
import { HttpErrorFilter } from './utils/exceptionresponse.filter'
import UserProfileController from './controller/userprofile.controller'
import { UserProfilesService } from './service/userProfile.service'
import TrayItemController from './controller/trayitem.controller'
import { TrayItemService } from './service/trayItem.service'
import StoreController from './controller/store.controller'
import { StoreService } from './service/store.service'
import MenuController from './controller/menu.controller'
import { MenuService } from './service/menu.service'
import userControllers from './controller/user.controller'
import { UserService } from './service/user.service'
import NotificationController from './controller/notification.controller'
import { NotificationService } from './service/notification.service'
import { NotificationSettingService } from './service/notificationsetting.service'
import NotificationSettingController from './controller/notificationsetting.controller'
import RackController from './controller/rack.controller'
import { RackService } from './service/rack.service'
import { EscalationController } from './controller/escalation.controller'
import FileControllers from './controller/file.controller'
import FiledownloadControllers from './controller/filedownload.controller'
import formControllers from './controller/form.controller'
import { FileService } from './service/file.service'
import { FileDownLoadService } from './service/fileDownload.service'
import { FormService } from './service/form.service'
import { User } from './models/user.model'
import { Client } from './models/client.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserNotification } from './middleware/userNotification'
import { UserProfile } from './models/userProfile.model'
import { Role } from './models/role.model'
import { TrayItem } from './models/trayItem.model'
import { Store } from './models/store.model'
import { Plan } from './models/plan.model'
import { UserPreference } from './models/userPreference.model'
import TemplateControllers from './controller/template.controller'
import { TemplateService } from './service/template.service'
import { Menu } from './models/menu.model'
import { Rack } from './models/rack.model'
import { Tray } from './models/tray.model'
import { Escalation } from './models/esculation.model'
import { File } from './models/file.model'
import { Template } from './models/item.model'
import { ItemForms } from './models/itemForm.model'
import { ItemTemplate } from './models/itemTemplate.model'
import { ItemTemplateProperty } from './models/itemTemplateProperty.model'
import { NotificationSettings } from './models/notificationSettings.model'
import { UserStore } from './models/userStore.model'
import { Notification } from './models/notification.model'
import { UserStoreServices } from './service/userStore.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'
import { AuthService } from './auth/auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './auth/constants'
import { LocalStrategy } from './auth/strategies/local.strategy'
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { AuthController } from './auth/auth.controller'
import { Support } from './models/support.model'
import SupportController from './controller/support.controller'
import { SupportService } from './service/support.service'
import { ServeStaticModule } from '@nestjs/serve-static'
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      repositoryMode: true,
      dialect: 'postgres',
      host: '209.133.209.251',
      port: 5432,
      username: 'dypmbjde_rmstest',
      password: 'xvRFk60dg5W4',
      database: 'dypmbjde_rms_test',
      autoLoadModels: true
    }),
    SequelizeModule.forFeature([
      User,
      Client,
      UserProfile,
      Role,
      TrayItem,
      Store,
      UserPreference,
      Plan,
      Menu,
      Rack,
      Tray,
      Escalation,
      File,
      Template,
      ItemForms,
      ItemTemplate,
      ItemTemplateProperty,
      NotificationSettings,
      UserStore,
      Notification,
      Support
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'mail.electems.com',
        port: 465,
        ssl: false,
        tls: true,
        auth: {
          user: 'shashi@electems.com',
          pass: 'cybRVE12#'
        }
      },
      template: {
        dir: join(__dirname.split('dist')[0], '.././views/'),

        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: 'resources/static/assets/uploads'
    })
  ],
  controllers: [
    userPrefernceControllers,
    UserProfileController,
    TrayItemController,
    StoreController,
    MenuController,
    userControllers,
    NotificationController,
    NotificationSettingController,
    RackController,
    EscalationController,
    FileControllers,
    FiledownloadControllers,
    formControllers,
    TemplateControllers,
    AuthController,
    SupportController
  ],
  providers: [
    UserProfilesService,
    UserPreferenceService,
    TrayItemService,
    StoreService,
    MenuService,
    UserService,
    SupportService,
    NotificationService,
    NotificationSettingService,
    RackService,
    FileService,
    FileDownLoadService,
    FormService,
    TemplateService,
    UserNotification,
    UserStoreServices,
    AuthService,
    EscalationController,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    }
  ]
})
export class AppModule {}
