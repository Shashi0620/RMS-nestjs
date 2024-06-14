/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */

/* eslint-disable filenames/match-regex */
import {userAdmin} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'
const baseUrl = environment.baseUrl
let token = ''
beforeEach(() => {
  cy.request({
    method: 'POST',
    url: environment.authloginUrl,
    body: {
      user: {
        username: userAdmin.username,
        password: userAdmin.password
      }
    }
  }).then(resp => {
    token = resp.body.access_token
    localStorage.setItem('tokens', resp.body.access_token)
  })
})
describe('ForgotPasseord', () => {
  it('ResetPassword', () => {
    cy.visit('/')
    cy.get('button').eq(3).click()
    cy.get('[id="forgotpassword"]').click()
    const email = userAdmin.email
    cy.get('[id="emaildata"]').eq(0).type(email)
    cy.get('[id="Recoveraccess"]').click()
    cy.task('connectDB', `SELECT * FROM notifications WHERE email = '${email}' AND "notificationType" = 'FORGOTPASSWORD' AND status = 'NEW'`
    ).then(queryResponse => {
      console.log(queryResponse)
    })
    cy.task('connectDB',  `SELECT * FROM notifications WHERE email = '${email}' AND "notificationType" = 'FORGOTPASSWORD' AND status = 'SENT'`
    ).then(queryResponse => {
      console.log(queryResponse)
    })
    cy.get('a[href*="login"]').eq(0).click({force: true})
  })
})
