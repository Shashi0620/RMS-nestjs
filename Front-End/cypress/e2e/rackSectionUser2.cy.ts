/* eslint-disable github/no-then */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/* eslint-disable filenames/match-regex */
/* eslint-disable no-console */
import {companyAdmin, companyStaff1, company, staff} from './e2e-constants.cy'
import {faker} from '@faker-js/faker'
import {environment} from 'src/environments/environment'
const testUpdateRackRecord = {
  name: 'Rack1',
  noOfRows: 2,
  noOfColumns: 2,
  store: 'Walmart'
}
const rackSelect = {
  rackName: 'r1c1'
}
let token = ''
beforeEach(() => {
  cy.request({
    method: 'POST',
    url: environment.authloginUrl,
    body: {
      user: {
        username: company.username,
        password: company.pwd
      }
    }
  }).then(resp => {
    token = resp.body.access_token
    localStorage.setItem('tokens', resp.body.access_token)
  })
})
describe('Staff Login > Rack > CRUD', () => {
  it('Staff Login >View Rack > Tray Crud', () => {
    cy.login(staff.username, staff.pwd)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.contains('Listing')
    cy.get('[id="racklisting"]')
      .contains('mat-row', testUpdateRackRecord.name)
      .should('be.visible')
    cy.get('[id="view_rack"]').eq(0).click()
    cy.get('[id="grid"]').contains(rackSelect.rackName).click({force: true})
    cy.get('[id="rack_back"]').click({force: true})
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.logout()
  })
})
