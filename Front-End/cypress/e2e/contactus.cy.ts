/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable prettier/prettier */
/* eslint-disable filenames/match-regex */
import {companyAdmin2, userAdmin, contactus} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'

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
    localStorage.setItem('tokens', resp.body.access_token)
  })
})

describe('Home', () => {
  it('Rack Managemant > Contactus > SendMail', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="user-profile"]').click('topRight')
    cy.get('[id="contact_us"]').click()
    cy.get('[id="fullname"]').type(contactus.Username)
    cy.get('[id="message"]').type(contactus.Message)
    cy.get('[id="submit"]').click()
    const userId = sessionStorage.getItem('userObj')
    cy.task('connectDB', {
      query: `SELECT * FROM notifications WHERE "userFk"= ${userId.id} AND "notificationType" ='CONTACT-US'`
    }).then(queryResponse => {
      console.log(queryResponse)
      cy.get(queryResponse.status).should('SENT')
    })
  })
})
