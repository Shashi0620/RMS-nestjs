/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/* eslint-disable filenames/match-regex */
/* eslint-disable no-console */

import {
  userAdmin,
  staffRecord2,
  updateStaffRecord,
  timeOut,
  notificationSettingRecord,
  addproduct,
  updateQuantity,
  addproduct4,
  updateRackRecord
} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'
const rackSelect = {
  rackName: 'r0c0'
}
const selectProduct = {
  product: 'Product_2_' + userAdmin.username
}

// userAdmin.username = 'shashis11'
// userAdmin.password = 'cybis@ban'
// notificationSettingRecord.NotificationName = 'numquam-notification'
// notificationSettingRecord.Email = 'sed@electems.com'
// addproduct.productname= 'Potato'
// updateStaffRecord.Username = 'veritatisAdmin764.ullam-staff2Name411'
// updateStaffRecord.Password = 'cybis@ban'
// updateRackRecord.name= 'harum-rackName'
// addproduct4.productname ='Cheese-productName'


const templateName = 'Product 9 ' + userAdmin.username
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
describe('Notification > CRUD', () => {
  /*
  Execution steps: 
    -
  */
  it(' Login > FirstStaff', () => {
    cy.login(updateStaffRecord.Username, updateStaffRecord.Password)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.wait(timeOut.delay_2)
    cy.contains('Listing')

    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .find('[id="view_rack"]')
      .click({ force: true })
    
    cy.get('[id="grid"]').contains(rackSelect.rackName).click({force: true})

    cy.get('[id="add_items"]').click({force: true})
    cy.get('[id="Switch To product View"]').click({ force: true })
    cy.get('[id="product-dropdownMenu"]').click({ force: true })    
    cy.get('[id="selectProduct"]').contains(templateName).click({force: true})

    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', addproduct4.productname)
      .find('[id="quantity"]')
    cy.get('[id="quantity"]').clear()
    cy.get('[id="store_view"]')
      .contains('mat-row', addproduct4.productname)
      .find('[id="quantity"]')
      .type(updateQuantity.updateQuantity)
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', addproduct4.productname)
      .find('[id="save_tray"]')
      .click()
    cy.wait(timeOut.delay_2)

    cy.get('[id="Switch To Tray View"]').click({ force: true })
    cy.wait(timeOut.delay_2)
    cy.get('[id="product-dropdownMenu"]').click({ force: true })
    cy.get('[id="selectProduct"]').contains(templateName).click({ force: true })
    cy.wait(timeOut.delay_3)
    cy.get('[id="store_view"]')
      .contains('mat-row', addproduct4.productname)
      .find('[id="edit_notification"]')
      .click()
    cy.wait(timeOut.delay_3)
    cy.get('[id="lowerLimit"]').eq(0).clear()
    cy.get('[id="higherLimit"]').eq(0).clear()
    cy.get('[id="lowerLimit"]').eq(0).type('2')
    cy.get('[id="higherLimit"]').eq(0).type('10')
    cy.get('[id="select_notifiction"]')
      .eq(0)
      .click()
      .eq(0)
      .contains(notificationSettingRecord.NotificationName)
    cy.get('[id="update_notification"]').contains('Save Notification').click()
    cy.get('[id="store_view"]')
      .contains('mat-row', addproduct4.productname)
      .find('[id="save_tray"]')
      .click({force: true})

    cy.wait(timeOut.delay_4)
    cy.request({
      method: 'GET',
      url: environment.baseUrl + '/api/notification/sendEmailNotification',
      body: {
        user: {
          username: userAdmin.username,
          password: userAdmin.password
        }
      },
      headers: {
        Authorization: `bearer ${token}`
      }

    })

    cy.wait(timeOut.delay_5)
    //cy.visit('/template') 
    cy.get('[id="dropdownbell"]').click()

    cy.task(
      'connectDB',
      `SELECT * FROM notifications WHERE email = '${notificationSettingRecord.Email}'
      AND "notificationType" = 'QUANTITY-ALERT' AND status = 'NEW'`
    ).then(queryResponse => {
      console.log(queryResponse)
    })
    cy.logout()
  })

  it('Login > SecondStaff', () => {
    cy.login(updateStaffRecord.Username, updateStaffRecord.Password)

    cy.get('[id="dropdownbell"]').click()
    cy.get('[ class="dropdown-menu"]')
    cy.get('[id="dropdownbell"]').click()
    cy.task(
      'connectDB',
      `SELECT * FROM notifications WHERE email = '${notificationSettingRecord.Email}'
      AND "notificationType" = 'QUANTITY-ALERT' AND status = 'NEW'`
    ).then(queryResponse => {
      console.log(queryResponse)
    })
    cy.logout()
  })

  it('Login > Admin', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="dropdownbell"]').click()
    cy.get('[ class="dropdown-menu"]')
    cy.task(
      'connectDB',
      `SELECT * FROM notifications WHERE "notificationType" = 'QUANTITY-ALERT' AND status = 'NEW'`
    ).then(queryResponse => {
      console.log(queryResponse)
    })
    cy.logout()
  })
})
