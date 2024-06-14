import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import hbs from 'express-handlebars'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    allowedHeaders: '*',
    origin: '*'
  })
  app.setBaseViewsDir(join(__dirname, '../../views/'))
  app.engine(
    'hbs',
    hbs({
      extname: 'hbs',
      defaultLayout: '',
      layoutsDir: join(__dirname, '../../views/')
    })
  )
  app.setViewEngine('hbs')

  await app.listen(3000)
}
bootstrap()
