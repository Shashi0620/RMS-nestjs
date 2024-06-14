/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
/* eslint-disable github/no-then */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/* eslint-disable filenames/match-regex */
/* eslint-disable no-console */
import {
  userAdmin,
  updateStaffRecord,
  rackRecord,
  updateRackRecord,
  updateStoreRecord,
  timeOut
} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'

// userAdmin.username = 'shashis11'
// userAdmin.password = 'cybis@ban'
// rackRecord.store = 'Vegetables store'
// updateStoreRecord.StoreName = 'Vegetables store'

const rackSelect = {
  rackRename: 'Dress Rack'
}

const rack = {
  rack: 'r1c1'
}

const rack2 = {
  rack: 'r1c2'
}

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

describe('Company Admin Login > Rack > CRUD', () => {
  it('RackListing', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.contains('Listing')
  })

  it('RackAdd', () => {
    cy.authenticaion(token)
    cy.get('[id="add_rack"]').contains('Add').click({force: true})
    cy.get('[id="save_rack"]').contains('Save Racks').click({force: true})
    cy.get('[id="rack_form"]').contains('RacksName is required')
    // cy.get('[id="rack_form"]').contains('Number Of Rows is required')
    // cy.get('[id="rack_form"]').contains('Number Of Columns is required')
    cy.get('[id="rack_form"]').contains('Stores is required')
    cy.get('[id="name"]').type(rackRecord.name)
    // cy.get('[id="no_of_rows"]').type(rackRecord.noOfRows.toString())
    // cy.get('[id="no_of_columns"]').type(rackRecord.noOfColumns.toString())
    cy.get('[id="select_stores"]').eq(0).select(updateStoreRecord.StoreName)
    cy.get('[id="save_rack"]').contains('Save Racks').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id="racklisting"]')
      .contains('mat-row', rackRecord.name)
      .should('be.visible')
  })

  it('RackEdit', () => {
    cy.authenticaion(token)
    cy.get('[id="racklisting"]')
      .contains('mat-row', rackRecord.name)
      .should('be.visible')
      .find('[id="editrack"]')
      .click()
    cy.get('[id="name"]').should('contain.value', rackRecord.name)
    // cy.get('[id="no_of_rows"]').should('contain.value', rackRecord.noOfRows)
    // cy.get('[id="no_of_columns"]').should(
    //   'contain.value',
    //   rackRecord.noOfColumns
    // )
    //  cy.get('[id="select_stores"]').should('contain.value', rackRecord.store)
    cy.get('[id="name"]').clear()
    // cy.get('[id="no_of_rows"]').clear()
    // cy.get('[id="no_of_columns"]').clear()
    cy.get('[id="select_stores"]').invoke('val', '')
    cy.get('[id="update_rack"]').contains('Update Racks').click({force: true})
    cy.get('[id="name"]').type(updateRackRecord.name)
    // cy.get('[id="no_of_rows"]').type(updateRackRecord.noOfRows.toString())
    // cy.get('[id="no_of_columns"]').type(updateRackRecord.noOfColumns.toString())
    cy.get('[id="select_stores"]').select(updateStoreRecord.StoreName)
    cy.get('[id="update_rack"]').contains('Update Racks').click({force: true})
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
  })

  it('Rack Listing > View Rack', () => {
    cy.authenticaion(token)
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
    cy.get('[id="racklisting"]')
      .contains('mat-row', rackRecord.name)
      .should('be.visible')
      .find('[id="view_rack"]')
      .click()
  })

  it('View Rack > Tray Crud', () => {
    cy.get('[id="grid"]').contains(rack.rack).click({force: true})
    cy.get('[id="copy_tray"]').contains('Copy').click({force: true})
    cy.get('[id="remove_tray"]').contains('Delete').click({force: true})
    cy.window().contains('Please Confirm!')
    cy.contains('button', 'Yes').click()
    //Remove Tray removes tray but didnt updated in element so i used reload here
    // cy.reload()
    cy.wait(4000)
    cy.get('[id="grid"]').contains(rack2.rack).click({force: true})
    // cy.get('[id="tray_img_upload"]').click({force: true})
    // const filepath = 'download.png'
    // cy.get('input[type="file"]').attachFile(filepath)
    // cy.get('[id="color_picker"]').click({force: true})
    // cy.get('[id="searchable"]').should('be.checked')
    // cy.get('[id="rack_name_change"]').clear()
    // cy.get('[id="rack_name_change"]').type(rackSelect.rackRename)
    // cy.get('[id="rack_name_change"]').should(
    //   'contain.value',
    //   rackSelect.rackRename
    // )
    // cy.get('[id="save_tray"]')
    //   .contains('Save')
    //   .click({force: true})
    //   .click({force: true})
    cy.get('[id="back"]').click({force: true})
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.logout()
  })
})

describe('Company Staff Login > Rack', () => {
  it('RackListing', () => {
    cy.login(updateStaffRecord.Username, updateStaffRecord.Password)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.contains('Listing')
  })

  it('View Rack > Staff', () => {
    cy.authenticaion(token)
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
    cy.get('[id="view_rack"]').eq(0).click()
    // cy.get('[id="grid"]').contains(rackSelect.rackRename).click({force: true})
    // cy.get('[id="rack_name_change"]').should(
    //   'contain.value',
    //   rackSelect.rackRename
    // )
    // cy.get('[id="back"]').click({force: true})
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.logout()
  })
})

describe('Company Admin Login > Rack > DeleteRack', () => {
  it('RackListing', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.contains('Listing')
  })
  it('Delete Rack', () => {
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
      .eq(0)
      .find('[id="delete_rack"]')
      .eq(0)
      .click()
    cy.window().contains('Please Confirm!')
    cy.contains('button', 'Yes, remove!').click()
    cy.contains(updateRackRecord.name).should('not.exist')
  })
  it('RackAdd', () => {
    cy.authenticaion(token)
    cy.get('[id="add_rack"]').contains('Add').click({force: true})
    cy.get('[id="save_rack"]').contains('Save Racks').click({force: true})
    cy.get('[id="rack_form"]').contains('RacksName is required')
    // cy.get('[id="rack_form"]').contains('Number Of Rows is required')
    // cy.get('[id="rack_form"]').contains('Number Of Columns is required')
    cy.get('[id="rack_form"]').contains('Stores is required')
    cy.get('[id="name"]').type(updateRackRecord.name)
    // cy.get('[id="no_of_rows"]').type(updateRackRecord.noOfRows.toString())
    // cy.get('[id="no_of_columns"]').type(updateRackRecord.noOfColumns.toString())
    cy.get('[id="select_stores"]').eq(0).select(updateStoreRecord.StoreName)
    cy.get('[id="save_rack"]').contains('Save Racks').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
    cy.logout()
  })
})
