import {
  notificationSettingRecord,
  password,
  rackSelect,
  selectProduct,
  timeOut,
  userAdmin
} from './e2e-constants.cy'

describe('showAllUserNotifications', () => {
  it('User Registered Notification', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="dropdownbell"]').click()
    cy.get('[id="newNotificationsList"]').contains('REGISTERED')
    cy.get('[id="dropdownbell"]').click()
    cy.logout()
  })

  it('Change Password Notification', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="user-profile"]').click()
    cy.get('[id="Change Password"]').click()
    cy.get('[id="password"]').type(userAdmin.password)
    cy.get('[id="confirmPassword"]').type(userAdmin.password)
    cy.get('[type="submit"]').click()
    cy.get('[id="change-password"]').click()
    cy.get('[id="loginuser"]').click()
    cy.login(userAdmin.username, password.password)
    cy.get('[id="dropdownbell"]').click()
    cy.get('[id="newNotificationsList"]').contains('CHANGEPASSWORD')
    cy.get('[id="dropdownbell"]').click()
    cy.logout()
  })

  it('QuantityAlert Notification', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.contains('Listing')
    cy.get('[id="view_rack"]').eq(3).click({force: true})
    cy.get('[id="grid"]').contains(rackSelect.rackRename).click({force: true})
    cy.get('[id="add_items"]').click({force: true})
    cy.get('[id="product-dropdownMenu"]').click()
    cy.get('[id="selectTemplates"]')
      .contains(selectProduct.product)
      .click({force: true})
    cy.wait(timeOut.delay_2)
    if (cy.get('[id="switch_button"]').contains(' Switch To Product View ')) {
      cy.get('[id="edit_notification"]').eq(0).click({force: true})
      cy.wait(timeOut.delay_2)
      cy.window().contains('Notification Setting for this tray')
      cy.wait(timeOut.delay_2)
      cy.get('[id="lowerLimit"]').eq(0).clear()
      cy.get('[id="higherLimit"]').eq(0).clear()
      cy.get('[ id="lowerLimit"]').eq(0).type('6')
      cy.get('[ id="higherLimit"]').eq(0).type('8')
      cy.get('[id="select_notifiction"]').eq(0).click()
      cy.get('[role="listbox"]')
        .contains(notificationSettingRecord.NotificationName)
        .click()
      cy.get('[  id="update_notification"]').eq(0).click()
      cy.get('[id="close"]').eq(0).click()
      cy.get('[id="save_tray"]').eq(0).click({force: true})
      cy.visit('/template')
      cy.logout()
    }
  })

  it('Staff Quantityalert Notification', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="dropdownbell"]').click()
    cy.get('[id="newNotificationsList"]').contains('QUANTITY-ALERT')
    cy.get('[id="dropdownbell"]').click()
    cy.logout()
  })
})
