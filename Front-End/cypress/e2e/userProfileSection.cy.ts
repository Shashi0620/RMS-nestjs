/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
/* eslint-disable filenames/match-regex */
import {faker} from '@faker-js/faker'
import {
  userAdmin,
  password,
  passwordMismatch,
  timeOut
} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'
// userAdmin.username = 'ShashiAdmin'
// userAdmin.password = 'cybis@ban'

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
describe('Login > Edit Profile', () => {
  it('EditUserProfileSuccessful', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="user-profile"]').click('topRight')
    cy.wait(3000)
    cy.get('[id="Update Profile"]').click('bottomRight', {
      multiple: true
    })
    cy.wait(5000)
    cy.get('[id="email"]').clear()
    const email = faker.lorem.word() + '@gmail.com'
    cy.get('[id="email"]').type(email)
    cy.get('[id="phone"]').clear()
    const phoneNumber = Math.floor(Math.random() * 10000000000)
    const phone = phoneNumber.toString()
    cy.get('[id="phone"]').type(phone)
    cy.get('[id="address"]').clear()
    const address = faker.lorem.word()
    cy.get('[id="address"]').type(address)
    const filepath = 'download.png'
    cy.get('input[type="file"]').attachFile(filepath)
    cy.get('[id="Update Profile"]').click('bottomRight', {
      multiple: true,
      force: true
    })

    // cy.visit('/template')
    cy.get('[id="user-profile"]').click('topRight', {
      multiple: true,
      force: true
    })
    cy.get('[id="Update Profile"]').click('bottomRight', {
      multiple: true,
      force: true
    })
    cy.get('[id="email"]').should('contain.value', email)
    cy.get('[id="phone"]').should('contain.value', phone)
    cy.get('[id="address"]').should('contain.value', address)
    cy.visit('/template')
  })
  it('EditUserProfileValidation', () => {
    cy.get('[id="user-profile"]').click('topRight')
    cy.get('[id="Update Profile"]').click('bottomRight', {
      multiple: true,
      force: true
    })
    cy.wait(5000)
    cy.get('[id="userName"]').clear()
    cy.get('[id="email"]').clear()
    cy.get('[id="phone"]').clear()
    cy.get('[id="address"]').clear()
    cy.wait(5000)
    cy.get('[id="Update Profile"]').click('bottomRight', {
      multiple: true,
      force: true
    })
    cy.get('[ id="editUserProfileForm"]').contains('UserName is required')
    cy.get('[ id="editUserProfileForm"]').contains('email is required')
    cy.get('[ id="editUserProfileForm"]').contains('phone is required')
    cy.get('[ id="editUserProfileForm"]').contains('address is required')
    cy.get('[id="cancel"]').click()
    cy.visit('/template')
    cy.logout()
  })
})
describe('Login > Change Password', () => {
  it('ChangeUserPassword', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[class="user-profile dropdown"]').click('topRight')
    cy.get('[id="Change Password"]')
      .contains('Change Password')
      .click({multiple: true, force: true})
    cy.get('[id="password"]').type(password.password)
    cy.get('[id="confirmPassword"]').type(password.confirmpassword)
    cy.get('[type="submit"]').click()
    cy.get('[id="change-password"]').click()
    cy.get('[id="loginuser"]').click()
    cy.login(userAdmin.username, password.password)
    cy.visit('/template')
  })
  it('ChangeUserPasswordMissMatchValidation', () => {
    cy.get('[class="user-profile dropdown"]').click('topRight')
    cy.get('[id="Change Password"]')
      .contains('Change Password')
      .click({multiple: true, force: true})
    cy.get('[id="password"]').type(passwordMismatch.password)
    cy.get('[id="confirmPassword"]').type(passwordMismatch.confirmpassword)
    cy.get('[type="submit"]').should('be.disabled')
    cy.get('[id="Close"]').click({force: true})
    cy.reload()
  })
  it('ChangeUserPasswordValidation', () => {
    cy.get('[class="user-profile dropdown"]').click('topRight')
    cy.get('[id="Change Password"]')
      .contains('Change Password')
      .click({multiple: true, force: true})
    cy.get('[id="password"]')
    cy.get('[id="confirmPassword"]')
    cy.get('[type="submit"]').should('be.disabled')
    cy.get('[id="Close"]').click({force: true})
    cy.logout()
  })
})
