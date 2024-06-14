/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
/* eslint-disable filenames/match-regex */
import {
  userAdmin,
  staffRecord,
  timeOut,
  updateStaffRecord,
  updateStoreRecord,
  staffRecord2,
  staffRecord3
} from './e2e-constants.cy'
import {faker} from '@faker-js/faker'
import {environment} from 'src/environments/environment'

// updateStoreRecord.StoreName = 'Vegetables store'
// userAdmin.username = 'shashis11'
// userAdmin.password = 'cybis@ban'

/* this added because while calling other apis it needs token access
every it condition in describe clears local storage so i am using beforeEach
method call at every it to get token in local storage*/
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
describe('CompanyLogin > staff > AddStaff', () => {
  it('AddStaff', () => {
    const authorization = `bearer ${token}`
    cy.request({
      method: 'GET',
      url: environment.translateUrl,
      headers: {
        Authorization: authorization
      }
    }).then(resp => {
      resp.body.map(data => localStorage.setItem(data['Key'], data['Value']))
    })
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id = "1"]').contains('Staff').click()
    cy.get('[id="Add_Staff"]').click()
    cy.get('[id="username"]')
    cy.get('[id="email"]')
    cy.get('[id="password"]')
    cy.get('[id="confirmPassword"]')
    cy.get('[id="CreateStaff"]').click()
    cy.get('[id="staffForm"]').contains(' Username is required ')
    cy.get('[id="staffForm"]').contains(' Email is required ')
    cy.get('[id="staffForm"]').contains(' Password is required ')
    cy.get('[id="staffForm"]').contains(' Confirm Password is required ')
    //cy.get('[id="staffForm"]').contains(' Store is required ')
    //eq(0) focus on the first input field of the form
    cy.get('[id="username"]').eq(0).focus().type(staffRecord.Username)
    // eq(0) focus on the first input field of the form
    cy.get('[id="email"]').eq(0).focus().type(staffRecord.Email)
    cy.get('[id="password"]').eq(0).focus().type(staffRecord.Password)
    cy.get('[id="confirmPassword"]')
      .eq(0)
      .focus()
      .type(staffRecord.ConfirmPassword)
    cy.get('[id="dropdowndata"]')
      .contains(updateStoreRecord.StoreName)
      .click({force: true})
    cy.get('[id="CreateStaff"]').click()
    cy.wait(timeOut.delay_3)
    cy.window().contains('Staff Registered Successfully!')
    cy.get('[type="button"]').contains('Ok').click({multiple: true})
  })
  it('EditStaff', () => {
    cy.get('[id = "1"]').contains('Staff').click()
    cy.get('[id="stafflisting"]')
      .contains('mat-row', staffRecord.Username)
      .should('be.visible')
      .find('[ id="editStaff"]')
      .click()
    cy.get('[id="username"]').should('contain.value', staffRecord.Username)
    cy.get('[id="email"]').should('contain.value', staffRecord.Email)
    cy.get('[id="username"]').clear()
    cy.get('[id="email"]').clear()
    cy.get('[id="password"]').eq(0).click({force: true}).clear({force: true})
    cy.get('[id="confirmPassword"]')
      .eq(0)
      .click({force: true})
      .clear({force: true})
    cy.get('[id="CreateStaff"]').click({force: true})
    cy.get('[id="username"]').type(updateStaffRecord.Username)
    cy.get('[id="email"]').type(updateStaffRecord.Email)
    cy.get('[id="password"]').eq(0).type(updateStaffRecord.Password)
    cy.get('[id="confirmPassword"]')
      .eq(0)
      .type(updateStaffRecord.ConfirmPassword)
    cy.get('[id="CreateStaff"]').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id = "1"]').contains('Staff').click()
    cy.get('[id="stafflisting"]')
      .contains('mat-row', updateStaffRecord.Username)
      .should('be.visible')
    cy.wait(timeOut.delay_3)
    cy.logout()
    cy.wait(timeOut.delay_2)
    cy.login(updateStaffRecord.Username, updateStaffRecord.Password)
    cy.wait(timeOut.delay_3)
    cy.logout()
  })

  it('Create Second Staff ', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id = "1"]').contains('Staff').click()
    cy.get('[id="Add_Staff"]').click()
    cy.get('[id="username"]').eq(0).focus().type(staffRecord2.Username)
    // eq(0) focus on the first input field of the form
    cy.get('[id="email"]').eq(0).focus().type(staffRecord2.Email)
    cy.get('[id="password"]').eq(0).focus().type(staffRecord2.Password)
    cy.get('[id="confirmPassword"]')
      .eq(0)
      .focus()
      .type(staffRecord2.ConfirmPassword)
    cy.get('[id="dropdowndata"]')
      .contains(updateStoreRecord.StoreName)
      .click({force: true})
    cy.get('[id="CreateStaff"]').click()
    cy.window().contains('Staff Registered Successfully!')
    cy.get('[type="button"]').contains('Ok').click({multiple: true})
    cy.wait(timeOut.delay_3)
  })

  it('Create Third Staff ', () => {
    cy.get('[id = "1"]').contains('Staff').click()
    cy.get('[id="Add_Staff"]').click()
    cy.get('[id="username"]').eq(0).focus().type(staffRecord3.Username)
    // eq(0) focus on the first input field of the form
    cy.get('[id="email"]').eq(0).focus().type(staffRecord3.Email)
    cy.get('[id="password"]').eq(0).focus().type(staffRecord3.Password)
    cy.get('[id="confirmPassword"]')
      .eq(0)
      .focus()
      .type(staffRecord3.ConfirmPassword)
    cy.get('[id="dropdowndata"]')
      .contains(updateStoreRecord.StoreName)
      .click({force: true})
    cy.get('[id="CreateStaff"]').click()
    cy.window().contains('Staff Registered Successfully!')
    cy.get('[type="button"]').contains('Ok').click({multiple: true})
    cy.wait(timeOut.delay_3)
  })

  it('DeleteStaff', () => {
    cy.get('[id = "1"]').contains('Staff').click()
    cy.get('[id="stafflisting"]')
      .contains('mat-row', staffRecord3.Username)
      .should('be.visible')
      .find('[id="delete_staff"]')
      .click()
    cy.window().contains('Please Confirm!')
    cy.contains('button', 'Yes, remove!').click()
    cy.wait(timeOut.delay_2)
    cy.get('[id="stafflisting"]')
      .contains('mat-row', staffRecord3.Username)
      .should('not.exist')
    cy.logout()
  })
})
