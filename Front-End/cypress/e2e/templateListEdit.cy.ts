/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
/* eslint-disable filenames/match-regex */

import {environment} from 'src/environments/environment'
import {
  userAdmin,
  addproduct,
  selectTemplate,
  timeOut,
  userData
} from './e2e-constants.cy'

// // userAdmin.username = 'shashis11'
// userAdmin.password = 'cybis@ban'
// userData.clientFk = 315
let templateName = ''

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

describe('Template Listing', () => {
  it('Edit Template Testing', () => {
    cy.login(userAdmin.username, userAdmin.password)
    //  cy.contains('td', selectTemplate.template).siblings().find('[class="bi-pencil-fill mr-4 edit-icon"]').click()
    //  cy.log('Drag and Drop Email and text field')
    //  cy.wait(5000)
    //   //add new fields manually
    //  cy.get('[id="dndSourceAreaText"]').drag('[id="dndDropArea"]')
    //  cy.get('[id="dndSourceAreaEmail"]').drag('[id="dndDropArea"]')
    //  cy.get('[id="save"]').click()
    //  cy.visit('/template')

    const filepath = '../Front-End/cypress/fixtures/insertqueryfortemplate.sql'
    cy.readFile(filepath, 'utf8').then(str => {
      str = str.toString()
      templateName = 'Product_9_' + userAdmin.username
      const templateName2 = 'Product_3_' + userAdmin.username
      const templateName3 = 'Product_7_' + userAdmin.username
      const clientFk = userData.clientFk
      cy.task(
        'connectDB',
        `UPDATE "templates"
       SET "attributes" = ${str}
       WHERE "clientFk" = ${clientFk} AND "name" = '${templateName}'`
      ).then(queryResponse => {
        console.log(queryResponse)
      })
      cy.task(
        'connectDB',
        `UPDATE "templates"
       SET "attributes" = ${str}
       WHERE "clientFk" = ${clientFk} AND "name" = '${templateName2}'`
      ).then(queryResponse => {
        console.log(queryResponse)
      })
      cy.task(
        'connectDB',
        `UPDATE "templates"
       SET "attributes" = ${str}
       WHERE "clientFk" = ${clientFk} AND "name" = '${templateName3}'`
      ).then(queryResponse => {
        console.log(queryResponse)
      })
    })
  })

  it('Fields Validation Of template', () => {
    cy.authenticaion(token)
    cy.get('[id="dropdown"]').click()
    cy.get('[id="selectTemplate"]')
      .contains(templateName.replace(/_/g, ' '))
      .click({force: true})
    cy.get('[id="add_product"]').click()
    cy.wait(timeOut.delay_3)
    cy.get('[id="Product_quantity"]')
    cy.get('[id="product_input"]').eq(0)
    cy.get('[id="Product_quantity"]')
    cy.get('[ id="cancel"]').click()
  })

  it('Fields Varification Of template', () => {
    cy.get('[id="add_product"]').click()
    cy.wait(timeOut.delay_3)
    cy.get('[id="Product_quantity"]').type(addproduct.quantity.toString())
    cy.get('[id="product_input"]').eq(0)
    cy.get('[type="text"]').type(addproduct.productname)
    cy.get('[id="Product_quantity"]').clear()
    cy.get('[id="Product_quantity"]').type(addproduct.quantity.toString())
    cy.get('[id="product_input"]')
    cy.get('[type="number"]').eq(0).clear()
    cy.get('[type="number"]').eq(0).type(addproduct.weight.toString())
    cy.get('[id="save_product"]').click()
    cy.wait(timeOut.delay_3)
    cy.get('[id="productlisting"]')
      .contains(addproduct.productname)
      .should('be.visible')
    cy.wait(timeOut.delay_2)
    //Here Have to check column enable and disable and see disabled column is shown or not
    //it is not working in automated we have to do it manually
    cy.get('[id="columns"]').click({force: true})
    cy.get('[role="menu"]').contains('Id')
    cy.get('[role="menu"]').contains('Product Name')
    cy.get('[role="menu"]').contains('Product Launch Date')
    cy.get('[role="menu"]').contains('Product Description')
    cy.get('[role="menu"]').contains('Product Specifications')
    cy.get('[role="menu"]').contains('Product type')
    cy.get('[id="columns"]').click({force: true})
  })

  it('Delete Added Fields Of Template', () => {
    cy.get('[id="1"]').contains('Categories').click({force: true})
    cy.contains('td', templateName.replace(/_/g, ' '))
      .siblings()
      .find('[class="bi-pencil-fill mr-4 edit-icon"]')
      .click()
    cy.get('[id="delete"]').eq(2).click()
    cy.window().contains('Do you want to remove this field?')
    cy.get('[class="swal2-confirm swal2-styled"]').click()
    cy.get('[id="dndDropArea"]').should('not.contain', 'Email')
    cy.get('[id="save"]').click()
    cy.visit('/template')
  })

  it('Deleted Fields Verification Of template', () => {
    cy.get('[id="dropdown"]').click()
    cy.get('[id="selectTemplate"]')
      .contains(templateName.replace(/_/g, ' '))
      .click({force: true})
    cy.get('[id="add_product"]').click()
    cy.wait(timeOut.delay_2)
    cy.get('[id="Product_quantity"]')
    cy.get('[id="product_input"]').eq(0).should('not.contain', 'Email')
    cy.get('[ id="cancel"]').click()
    cy.logout()
  })
})
