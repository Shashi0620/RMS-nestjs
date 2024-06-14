/* eslint-disable github/no-then */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.

import {faker} from '@faker-js/faker'
import {environment} from '../../src/environments/environment'
import {
  addproduct,
  addproductForTimeInterval,
  createQuantity,
  timeOut,
  updateRackRecord,
  updateStoreRecord,
  userAdmin
} from '../e2e/e2e-constants.cy'
const baseUrl = environment.authloginUrl
// ***********************************************

const rackSelect = {
  rackName: 'r0c0'
}

//userAdmin.username = 'ShashiAdmin'
const selectProduct = {
  product: 'Product 7 ' + userAdmin.username
}
const selectRack = {
  rack: updateRackRecord.name
}

//updateRackRecord.name = 'autem-rackName'
const store = {
  store: updateStoreRecord.StoreName
}
//updateStoreRecord.StoreName = 'impedit-storeName'
declare namespace Cypress {
  interface Chainable<Subject = any> {
    [x: string]: any
    login(username: string, password: string): typeof login
    register(
      username: string,
      email: string,
      password: string,
      confirmPassword: string,
      phone: number,
      location: string,
      plan: string
    ): typeof registration
    logout(): typeof logout
    quantityLowerLimitHigherLimitSet(
      quantity: string,
      lowerlimit: string,
      upperlimit: string,
      notificationSettingName: string
    ): typeof quantityLowerLimitHigherLimitSet

    quantityLowerLimitHigherLimitSet2(
      quantity: string,
      lowerlimit: string,
      upperlimit: string,
      notificationSettingName: string
    ): typeof quantityLowerLimitHigherLimitSet2
    staffQuantityLowerLimitHigherLimitSet(
      quantity: string,
      lowerlimit: string,
      upperlimit: string,
      notificationSettingName: string
    ): typeof staffQuantityLowerLimitHigherLimitSet

    notificationSetting(
      NotificationName: string,
      Email: string,
      noOFReminders: string,
      timeInterval: string,
      storeName:string
    ): typeof notificationSetting
    addNewProducts(
      quantity: string,
      name: string,
      email: string
    ): typeof addNewProducts
    createRack(
      name: string,
      noOfRows: string,
      noOfColumns: string,
      store: string
    ): typeof createRack
  }
}

function login(username: string, password: string): void {
  cy.clearLocalStorage()
  cy.clearAllSessionStorage()
  cy.visit('/')
  cy.get('button').eq(3).click()
  cy.get('[formControlName="username"]').eq(0).type(username, {force: true})
  cy.get('[formControlName="password"]').eq(0).type(password, {force: true})
  cy.get('input[id="exampleCheck1"]').check()
  cy.get('[id="login"]').contains('Login').click({force: true})
  cy.wait(timeOut.delay_3)
  //to check the authentication api is calling in the network call or not
  cy.intercept(baseUrl).as('addAuthHeader')
  cy.wait(timeOut.delay_3)
  cy.get('[id="cancel"]').click()
  cy.wait(2000)
}

function logout(): void {
  cy.get('[id="user-profile"]').click()
  cy.get('[id="logout"]').click({force: true})
  cy.window().contains('Are you sure?')
  cy.get('[class="swal2-confirm swal2-styled"]').click()
  // cy.login('company2', 'company2')
}

function registration(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone: string,
  location: string
  // plan: string
): void {
  cy.visit('/')
  cy.get('button').eq(4).click()
  cy.get('[id="username"]')
  cy.get('[id="email"]')
  cy.get('[id="password"]')
  cy.get('[id="confirmPassword"]')
  cy.get('[id="phone"]')
  cy.get('[id="location"]')
  // cy.get('[formControlName="plan"]')
  cy.get('input[id="checkbox"]')
  cy.get('[id="create_new_account"]')
    .contains('Create new account')
    .click({force: true})
  cy.get('[id="registerForm"]').contains('Username is required')
  cy.get('[id="registerForm"]').contains('Email is required')
  cy.get('[id="registerForm"]').contains('Password is required')
  cy.get('[id="registerForm"]').contains('Confirm Password is required')
  cy.get('[id="registerForm"]').contains('Phone is required')
  cy.get('[id="registerForm"]').contains('Location is required')
  cy.get('[id="registerForm"]').contains('I have read and agree to the Terms')
  cy.get('[id="registerForm"]').contains('Accept Terms is required')
  cy.get('[id="username"]').eq(1).type(username, {force: true})
  cy.get('[id="email"]').eq(0).type(email)
  cy.get('[id="password"]').eq(1).type(password, {force: true})
  cy.get('[id="confirmPassword"]').type(confirmPassword, {
    force: true
  })
  cy.get('[id="phone"]').type(phone.toString(), {force: true})
  cy.get('[id="location"]').type(location, {force: true})
  // cy.get('[formControlName="plan"]').select(plan, {force: true})
  cy.get('input[id="checkbox"]').check()
  cy.get('[id="create_new_account"]')
    .contains('Create new account')
    .click({force: true})
  cy.wait(5000)
  cy.get('[type="button"]').contains('Ok').click()
}
function quantityLowerLimitHigherLimitSet(
  quantity: string,
  lowerlimit: string,
  upperlimit: string,
  notificationSettingName: string,
  productName:string,
  rackName: string,
  userName: string
): void {
  const selectProduct = {
    product: 'Product 7 ' + userName
  }
  cy.get('[id="1"]').contains('Racks').click({force: true})
  cy.contains('Listing')
  cy.get('[id="racklisting"]')
    .contains('mat-row', rackName)
    .should('be.visible')
    .find('[id="view_rack"]')
    .click()
  cy.get('[id="grid"]').contains(rackSelect.rackName).click({force: true})
  cy.get('[id="add_items"]').click({force: true})
  //

  cy.get('[id="Switch To product View"]').click({force: true})
  cy.get('[id="product-dropdownMenu"]').click({ force: true })
  cy.wait(timeOut.delay_4) 
  cy.get('[id="selectProduct"]').contains(selectProduct.product).click()



  cy.wait(timeOut.delay_2)
  // cy.get('[id="selectTemplates"]')
  //   .contains(selectProduct.product)
  //   .click({force: true})
  // cy.wait(timeOut.delay_3)
  // cy.get('[id="switch_button"]')
  //   .contains('switch to product view')
  //   .click({force: true})
  
  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="quantity"]')
    .type('10')
  cy.wait(timeOut.delay_2)
  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="save_tray"]')
    .click()

  cy.wait(timeOut.delay_2)

  cy.get('[id="Switch To Tray View"]').click({ force: true })
  cy.wait(timeOut.delay_2)
  cy.get('[id="product-dropdownMenu"]').click({ force: true })
  cy.wait(timeOut.delay_4)
  cy.get('[id="selectProduct"]').contains(selectProduct.product).click()
  cy.wait(timeOut.delay_3)

  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="edit_notification"]')
    .click({ force: true })
   cy.wait(timeOut.delay_3)
  cy.get('[id="lowerLimit"]').eq(0).clear()
  cy.get('[id="higherLimit"]').eq(0).clear()
  cy.get('[id="lowerLimit"]').eq(0).type(lowerlimit)
  cy.get('[id="higherLimit"]').eq(0).type(upperlimit)
  cy.get('[id="select_notifiction"]')
    .eq(0)
    .click()
    .eq(0)
    .contains(notificationSettingName)
    .click()
  cy.get('[id="update_notification"]').contains('Save Notification').click()
  cy.wait(timeOut.delay_2)

    cy.get('[id="store_view"]')
      .contains('mat-row', productName)
      .find('[id="updateQuantity"]')
      .clear()
  cy.wait(timeOut.delay_2)
  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="updateQuantity"]')
    .type(quantity)

  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="save_tray"]')
    .click()
  // cy.get('[id="store_view"]').eq(0).find('[id="quantity"]').type(quantity)
 // cy.get('[id="quantity"]').eq(0).type(createQuantity.quantity)
  //cy.get('[id="store_view"]').eq(0).find('[id="edit_notification"]').click()
  // cy.get('[id="edit_notification"]').eq(0).click()
  //To load Modal Popup
  cy.wait(timeOut.delay_2)
}
//


function quantityLowerLimitHigherLimitSet2(
  quantity: string,
  lowerlimit: string,
  upperlimit: string,
  notificationSettingName: string,
  productName: string,
  rackName: string,
  userName:string
): void {
  const selectProduct = {
    product: 'Product 7 ' + userName
  }
  cy.get('[id="1"]').contains('Racks').click({ force: true })
  cy.contains('Listing')
  cy.get('[id="racklisting"]')
    .contains('mat-row', rackName)
    .should('be.visible')
    .find('[id="view_rack"]')
    .click()
  cy.get('[id="grid"]').contains(rackSelect.rackName).click({ force: true })
  cy.get('[id="add_items"]').click({ force: true })
  //

  cy.get('[id="Switch To product View"]').click({ force: true })
  cy.get('[id="product-dropdownMenu"]').click({ force: true })
  cy.wait(timeOut.delay_4)
  cy.get('[id="selectProduct"]').contains(selectProduct.product).click()



  cy.wait(timeOut.delay_2)
  // cy.get('[id="selectTemplates"]')
  //   .contains(selectProduct.product)
  //   .click({force: true})
  // cy.wait(timeOut.delay_3)
  // cy.get('[id="switch_button"]')
  //   .contains('switch to product view')
  //   .click({force: true})

  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="quantity"]')
    .type('40')
  cy.wait(timeOut.delay_2)
  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="save_tray"]')
    .click()

  cy.wait(timeOut.delay_2)

  cy.get('[id="Switch To Tray View"]').click({ force: true })
  cy.wait(timeOut.delay_2)
  cy.get('[id="product-dropdownMenu"]').click({ force: true })
  cy.wait(timeOut.delay_4)
  cy.get('[id="selectProduct"]').contains(selectProduct.product).click()
  cy.wait(timeOut.delay_3)

  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="edit_notification"]')
    .click({ force: true })
  cy.wait(timeOut.delay_3)
  cy.get('[id="lowerLimit"]').eq(0).clear()
  cy.get('[id="higherLimit"]').eq(0).clear()
  cy.get('[id="lowerLimit"]').eq(0).type(lowerlimit)
  cy.get('[id="higherLimit"]').eq(0).type(upperlimit)
  cy.get('[id="select_notifiction"]')
    .eq(0)
    .click()
    .eq(0)
    .contains(notificationSettingName)
    .click()
  cy.get('[id="update_notification"]').contains('Save Notification').click()
  cy.wait(timeOut.delay_2)

  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="updateQuantity"]')
    .clear()
  cy.wait(timeOut.delay_2)
  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="updateQuantity"]')
    .type(quantity)

  cy.get('[id="store_view"]')
    .contains('mat-row', productName)
    .find('[id="save_tray"]')
    .click()
  // cy.get('[id="store_view"]').eq(0).find('[id="quantity"]').type(quantity)
  // cy.get('[id="quantity"]').eq(0).type(createQuantity.quantity)
  //cy.get('[id="store_view"]').eq(0).find('[id="edit_notification"]').click()
  // cy.get('[id="edit_notification"]').eq(0).click()
  //To load Modal Popup
  cy.wait(timeOut.delay_2)
}
//



function staffQuantityLowerLimitHigherLimitSet(
  quantity: string,
  lowerlimit: string,
  upperlimit: string,
  notificationSettingName: string
): void {
  cy.get('[id="1"]').contains('Racks').click({force: true})
  cy.contains('Listing')
  cy.get('[id="racklisting"]')
    .contains('mat-row', selectRack.rack)
    .should('be.visible')
    .find('[id="view_rack"]')
    .click()
  cy.get('[id="grid"]').contains(rackSelect.rackName).click({force: true})
  cy.get('[id="add_items"]').click({force: true})
  cy.get('[id="product-dropdownMenu"]').eq(0).click({force: true})
  cy.get('[id="selectTemplates"]').contains(selectProduct.product)
  cy.get('[id="updateQuantity"]').eq(0).clear()
  cy.get('[id="updateQuantity"]').eq(0).type(quantity)
  // cy.get('[id="edit_notification"]').click({force: true})
  // cy.wait(timeOut.delay_2)
  // cy.get('[id="lowerLimit"]').eq(0).clear()
  // cy.get('[id="higherLimit"]').eq(0).clear()
  // cy.wait(timeOut.delay_2)
  // cy.get('[ id="lowerLimit"]').eq(0).type(lowerlimit)
  // cy.wait(timeOut.delay_2)
  // cy.get('[ id="higherLimit"]').eq(0).type(upperlimit)
  // cy.wait(timeOut.delay_2)
  // cy.get('[id="select_notifiction"]')
  //   .eq(0)
  //   .click()
  //   .eq(0)
  //   .contains(notificationSettingName)
  //   .click()
  //cy.get('[id="update_notification"]').contains('Notification').click()
  // cy.get('[id="close"]').contains('Close').click()
  cy.get('[id="save_tray"]').eq(0).click()
  cy.wait(timeOut.delay_2)
}

function notificationSetting(
  NotificationName: string,
  Email: string,
  noOFReminders: string,
  timeInterval: string,
  storeName: string
): void {
  cy.get('[id="1"]').contains('Stores').click({force: true})
  cy.contains('Listing')
  cy.get('[id="storelisiting"]')
    .contains('mat-row', storeName)
    .should('be.visible')
    .find('[ id="fetch_notifications"]')
    .click()
  cy.contains('Notifications')
  cy.get('[id="Add_Notification"]').click()
  cy.get('[id="notificationName"]').type(NotificationName)
  // cy.get('input[type="radio"]').eq(1).check('Email')
  cy.get('[id="to"]').type(Email)
  cy.get('[id="select_remainder"]')
    .select(noOFReminders, {force: true})
    .invoke('val')
  cy.get('[id="select_interval"]')
    .select(timeInterval, {force: true})
    .invoke('val')
  // cy.get('input[type="checkbox"]').check()
  cy.get('[id="save_notification"]').click()
}
function addNewProducts(quantity: string, email: string, name: string): void {
  cy.get('[id="Product_quantity"]').type(quantity)
  cy.wait(timeOut.delay_2)
  cy.get('[type="text"]').type(name)
  cy.get('[id="Product_quantity"]').clear()
  cy.get('[id="Product_quantity"]').type(quantity)
  cy.get('[id="save_product"]').click()
}
function createRack(name: string, store: string): void {
  cy.get('[id="1"]').contains('Racks').click({force: true})
  cy.contains('Listing')
  cy.get('[id="add_rack"]').contains('Add').click({force: true})
  cy.get('[id="name"]').type(name)
  // cy.get('[id="no_of_rows"]').type(noOfRows)
  // cy.get('[id="no_of_columns"]').type(noOfColumns)
  cy.get('[id="select_stores"]').select(store)
  cy.get('[id="save_rack"]').contains('Save').click({force: true})
  cy.wait(timeOut.delay_3)
  //cy.visit('/racks')
}

//
// NOTE: You can use it like so:
Cypress.Commands.add('login', login)
Cypress.Commands.add('logout', logout)
Cypress.Commands.add('registration', registration)
Cypress.Commands.add(
  'quantityLowerLimitHigherLimitSet',
  quantityLowerLimitHigherLimitSet
)
Cypress.Commands.add(
  'quantityLowerLimitHigherLimitSet2',
  quantityLowerLimitHigherLimitSet2
)
Cypress.Commands.add(
  'staffQuantityLowerLimitHigherLimitSet',
  staffQuantityLowerLimitHigherLimitSet
)
Cypress.Commands.add('notificationSetting', notificationSetting)
Cypress.Commands.add('addNewProducts', addNewProducts)
Cypress.Commands.add('createRack', createRack)
Cypress.Commands.add('authenticaion', (token: string) => {
  cy.request({
    method: 'GET',
    url: environment.translateUrl,
    headers: {
      Authorization: `bearer ${token}`
    }
  }).then(resp => {
    resp.body.map(data => localStorage.setItem(data['Key'], data['Value']))
  })
})
Cypress.Commands.add('authenticaionTimeInterval', (token: string) => {
  cy.request({
    method: 'GET',
    url: environment.notificationBasedOnTimeInterval,
    headers: {
      Authorization: `bearer ${token}`
    }
  }).then(resp => {
    resp.body.map(data => localStorage.setItem(data['Key'], data['Value']))
  })
})
// drag and drop
Cypress.Commands.add('draganddrop', (dragSelector, dropSelector) => {
  cy.get(dragSelector).should('exist').get(dropSelector).should('exist')

  const draggable = Cypress.$(dragSelector)[0] // Pick up this
  const droppable = Cypress.$(dropSelector)[0] // Drop over this

  const coords = droppable.getBoundingClientRect()
  draggable.dispatchEvent(new MouseEvent('mousedown'))
  draggable.dispatchEvent(
    new MouseEvent('mousemove', {clientX: 10, clientY: 0})
  )
  draggable.dispatchEvent(
    new MouseEvent('mousemove', {
      clientX: coords.left + 10,
      clientY: coords.top + 10 // A few extra pixels to get the ordering right
    })
  )
  draggable.dispatchEvent(new MouseEvent('mouseup'))
  return cy.get(dropSelector)
})

//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
