import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import * as Handlebars from 'handlebars'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import config from '../configemail.json'
const transport = nodemailer.createTransport({
  host: 'mail.electems.com',
  port: 465,
  ssl: false,
  tls: true,
  auth: {
    user: `${config.fromEmailAddress}`,
    pass: 'password'
  }
})
transport.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.hbs',
      partialsDir: global.__basedir + '../.././views/',
      layoutsDir: global.__basedir + '../.././views/',
      defaultLayout: '',
      handlebars: allowInsecurePrototypeAccess(Handlebars)
    },
    viewPath: global.__basedir + '../.././views/',
    extName: '.hbs'
  })
)
export default transport
