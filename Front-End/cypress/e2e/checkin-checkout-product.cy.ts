import {
  userAdmin,
  timeOut,
  template1_Product1,
  rack,
  userData,
  template1_Product2,
  updateRackRecord,
  template2_Product1,
  template2_Product2
} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'

// userAdmin.username = 'ShashiAdmin'
// userAdmin.password = 'cybis@ban'
// rack.rack = 'r1c1'
// userData.clientFk = 7
// updateRackRecord.name = 'eligendi-rackName'

/**
 * Below lines should not be commented
 */
const template1 = 'Product 4 ' + userAdmin.username
const template2 = 'Product 5 ' + userAdmin.username

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

/*
  Test case for testing Checkin: 
    - Delete 2 Template
    - Add Template1, Template2
    - Add Product_t1_1 with 300 q, Product_t1_2 to Template1 with 1000 quatity Only and Template2 is Empty
    - Open Rack > Tray View1 > Product View
    - Check in the Dropdown Template1 is present and Template2 is not present
    - Select Template1, validate Product_t1_1 & Product_t1_2 is visible in the Table. 
    
    - For Product_t1_1 enter 400 as the checkin quantity, validate error message. 
    - For Product_t1_1 enter 100 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 200
    - For Product_t1_2 enter 200 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 800
    - Click on "", dropdown should contain only Template1.  tray view is visible with Product_t1_1 with 100 as Quantity and Product_t1_2 with 200 as Quantity. 
    - Navigate to product listing of Template1, validate Product_t1_1 with 200 as Quantity and Product_t1_2 with 800 as Quantity. 
    - Add Product_t2_1 with 400 q, Product_t2_2 to Template2 with 700 quatity. 
    - Open Rack > Tray View1 
    - Dropdown should contain only Template1. Tray view is visible with Product_t1_1 with 100 as Quantity and Product_t1_2 with 200 as Quantity. 
    - Goto Product View
    - Check in the Dropdown Template1 & Template2 is present.
    - Select template 1. validate Product_t1_1 & Product_t1_2 is visible in the Table with Product_t1_1 -> Total_No_of_Quantities = 200 & Product_t1_2 > Total_No_of_Quantities = 800
    - For Product_t1_1 enter 50 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 150
    - For Product_t1_2 enter 300 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 500
    
    - Select template 2. validate Product_t2_1 & Product_t2_2 is visible in the Table with Product_t2_1 -> Total_No_of_Quantities = 400 & Product_t2_2 > Total_No_of_Quantities = 700
    - For Product_t2_1 enter 70 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 330
    - For Product_t2_2 enter 600 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 100
    
    - Click on "", dropdown should contain only Template1 & 2.  tray view is visible with Product_t1_1 with 100 as Quantity and Product_t1_2 with 200 as Quantity. 
    - Navigate to product listing of Template1, validate Product_t1_1 with 200 as Quantity and Product_t1_2 with 800 as Quantity. 
    - Add Product_t2_1 with 400 q, Product_t2_2 to Template2 with 700 quatity. 
    

   */

describe('CompanyLogin > Checkin Product To Tray', () => {
  /**
   * Delete 2 Template
   */
  it('CategoriesListing > Delete Categories', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="1"]').contains('Categories').click({force: true})
    cy.contains('td', template1)
      .siblings()
      .find('[id="Delete Template"]')
      .click()
    cy.window().contains('Are you sure?')
    cy.contains('button', 'Yes, remove!').click()
    cy.wait(timeOut.delay_3)
    cy.reload()
    cy.get('[id="1"]').contains('Categories').click({force: true})
    cy.contains('td', template1).should('not.exist')

    cy.contains('td', template2)
      .siblings()
      .find('[id="Delete Template"]')
      .click()
    cy.contains('button', 'Yes, remove!').click()
    cy.wait(timeOut.delay_3)
    cy.reload()
    cy.get('[id="1"]').contains('Categories').click({force: true})
    cy.contains('td', template2).should('not.exist')
  })

  /**
   * Add Template1, Template2
   */
  it('CategoriesListing > Create Categories', () => {
    cy.get('[id="1"]').contains('Categories').click({force: true})
    cy.get('[id="Add_Template"]').contains('Add').click({force: true})
    cy.get('[type="text"]').eq(0).click().type(template1)
    cy.get('[type="text"]').eq(1).click().type(template1)
    cy.get('[class="btn btn-primary"]').contains('Save').click()
    cy.wait(timeOut.delay_3)

    /**
     * template2
     */
    cy.get('[id="1"]').contains('Categories').click({force: true})
    cy.get('[id="Add_Template"]').contains('Add').click({force: true})
    cy.get('[type="text"]').eq(0).click().type(template2)
    cy.get('[type="text"]').eq(1).click().type(template2)
    cy.get('[class="btn btn-primary"]').contains('Save').click()
    cy.wait(timeOut.delay_3)
    cy.reload()
  })

  /**
   * Add fileds to Categories
   */
  it('Categories > Add Fields to Categories', () => {
    const filepath = '../Front-End/cypress/fixtures/insertqueryfortemplate.sql'
    cy.readFile(filepath, 'utf8').then(str => {
      str = str.toString()
      const clientFk = userData.clientFk
      cy.task(
        'connectDB',
        `UPDATE "templates"
       SET "attributes" = ${str}
       WHERE "clientFk" = ${clientFk} AND "name" = '${template1.replace(
          / /g,
          '_'
        )}'`
      ).then(queryResponse => {
        console.log(queryResponse)
      })
      cy.task(
        'connectDB',
        `UPDATE "templates"
       SET "attributes" = ${str}
       WHERE "clientFk" = ${clientFk} AND "name" = '${template2.replace(
          / /g,
          '_'
        )}'`
      ).then(queryResponse => {
        console.log(queryResponse)
      })
    })
  })

  /**
   * Add Product_t1_1 with 300 q, Product_t1_2 to Template1 with 1000 quatity Only and Template2 is Empty
   */
  it('Add Products To Template1', () => {
    cy.get('[id="dropdown"]').click({force: true})
    cy.get('[id="products"]').contains(template1).click({force: true})
    cy.wait(timeOut.delay_2)

    // product_t1_1
    cy.get('[id="add_product"]').click({force: true})
    cy.wait(timeOut.delay_2)
    cy.get('[id="Product_quantity"]').type('300')
    cy.get('[type="text"]').type(template1_Product1.productname)
    cy.get('[id="Product_quantity"]').clear()
    cy.get('[id="Product_quantity"]').type('300')
    cy.get('[id="save_product"]').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id="productlisting"]')
      .contains('mat-row', '300')
      .should('be.visible')
    cy.wait(timeOut.delay_2)

    // product_t1_2
    cy.get('[id="add_product"]').click({force: true})
    cy.wait(timeOut.delay_2)
    cy.get('[id="Product_quantity"]').type('1000')
    cy.get('[type="text"]').type(template1_Product2.productname)
    cy.get('[id="Product_quantity"]').clear()
    cy.get('[id="Product_quantity"]').type('1000')
    cy.get('[id="save_product"]').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id="productlisting"]')
      .contains('mat-row', '1000')
      .should('be.visible')
    cy.wait(timeOut.delay_2)
  })

  /**
   * Open Rack > Tray View1 > Product View
   */
  it('Rack > Tray View', () => {
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .find('[id="view_rack"]')
      .click()
    cy.get('[id="grid"]').contains(rack.rack).click({force: true})
    cy.get('[ id="add_items"]').click()
    cy.wait(timeOut.delay_4)
    cy.get('[id="noProductAlert"]').should('be.visible')
    cy.get('[id="Switch To product View"]').click({force: true})
  })

  it('Validate template1 Visible in Product View', () => {
    /**
     * dropdown should contain only Template1
     */
    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template1).click()

    /**
     * Select Template1, validate Product_t1_1 & Product_t1_2 is visible in the Table.
     */

    cy.get('[id="store_view"]').contains(
      'mat-row',
      template1_Product1.productname
    )

    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="quantity"]')
      .type('400')
    cy.wait(timeOut.delay_4)
    /**
     * For Product_t1_1 enter 400 as the checkin quantity, validate error message.
     */
    cy.window().contains('Quantity Alert!')
    cy.contains('Ok').click()

    /**
     * For Product_t1_1 enter 100 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 300
     */
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="quantity"]')
      .clear()
      .type('100')
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="save_tray"]')
      .click()
    cy.wait(timeOut.delay_4)

    cy.get('[id="store_view"]').contains('mat-row', '200')

    /**
     * For Product_t1_2 enter 200 as the checkin quantity, click on save.
     * Validate the the Total_No_of_Quantities is 800
     */
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="quantity"]')
      .clear()
      .type('200')

    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="save_tray"]')
      .click()

    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', '800')

    cy.get('[id="Switch To Tray View"]').click({force: true})
    cy.wait(timeOut.delay_3)

    /* Click on "Tray View Button", dropdown should contain only Template1.  
    tray view is visible with Product_t1_1 with 100 as Quantity and Product_t1_2 with 200 as Quantity. 
    */
    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template1).click()

    cy.get('[id="store_view"]')
      .contains('mat-row', '100')
      .find('[id="updateQuantity"]')
      .should('contain.value', '100')

    cy.get('[id="store_view"]')
      .contains('mat-row', '200')
      .find('[id="updateQuantity"]')
      .should('contain.value', '200')

    /**
     * Navigate to product listing of Template1, 
      validate Product_t1_1 with 200 as Quantity and Product_t1_2 with 800 as Quantity. 
     */
    cy.get('[id="dropdown"]').click({force: true})
    cy.get('[id="products"]').contains(template1).click({force: true})
    cy.wait(timeOut.delay_2)
    cy.get('[id="productlisting"]')
      .contains('mat-row', '200')
      .should('be.visible')

    cy.get('[id="productlisting"]')
      .contains('mat-row', '800')
      .should('be.visible')
  })

  /**
   * Add Product_t2_1 with 400 q, Product_t2_2 to Template2 with 700 quatity.
   */
  it('Add Products To Template2', () => {
    cy.get('[id="dropdown"]').click({force: true})
    cy.get('[id="products"]').contains(template2).click({force: true})
    cy.wait(timeOut.delay_2)

    /**
     *  product_t2_1
     */
    cy.get('[id="add_product"]').click({force: true})
    cy.wait(timeOut.delay_2)
    cy.get('[id="Product_quantity"]').type('400')
    cy.get('[type="text"]').type(template2_Product1.productname)
    cy.get('[id="Product_quantity"]').clear()
    cy.get('[id="Product_quantity"]').type('400')
    cy.get('[id="save_product"]').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id="productlisting"]')
      .contains('mat-row', '400')
      .should('be.visible')
    cy.wait(timeOut.delay_2)

    /**
     * product_t2_2
     */
    cy.get('[id="add_product"]').click({force: true})
    cy.wait(timeOut.delay_2)
    cy.get('[id="Product_quantity"]').type('700')
    cy.get('[type="text"]').type(template2_Product2.productname)
    cy.get('[id="Product_quantity"]').clear()
    cy.get('[id="Product_quantity"]').type('700')
    cy.get('[id="save_product"]').click({force: true})
    cy.wait(timeOut.delay_3)
    cy.get('[id="productlisting"]')
      .contains('mat-row', '700')
      .should('be.visible')
    cy.wait(timeOut.delay_2)
  })

  /**
   *Open Rack > Tray View1 > Product View
   */
  it('Rack > Tray View', () => {
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .find('[id="view_rack"]')
      .click()
    cy.get('[id="grid"]').contains(rack.rack).click({force: true})
    cy.get('[ id="add_items"]').click()
    cy.wait(timeOut.delay_4)
  })

  it('Chekin Products To Tray From Template2', () => {
    /**
     * Dropdown should contain only Template1.
     * Tray view is visible with Product_t1_1 with 100 as Quantity and Product_t1_2 with 200 as Quantity.
     */
    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template1).click()
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', '100')

    cy.get('[id="store_view"]').contains('mat-row', '200')
    /**
     * Goto Product View
     */
    cy.get('[id="Switch To product View"]').click({force: true})
    /**
     * Check in the Dropdown Template1 & Template2 is present.
     */
    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.wait(timeOut.delay_4)
    cy.get('[id="selectProduct"]').contains(template2)
    cy.get('[id="selectProduct"]').contains(template1).click({ force: true })
    cy.wait(timeOut.delay_4)
    /**
     * Select template 1.
     * validate Product_t1_1 & Product_t1_2 is visible in the Table
     * with Product_t1_1 -> Total_No_of_Quantities = 200 & Product_t1_2 > Total_No_of_Quantities = 800
     */

    cy.get('[id="store_view"]').contains('mat-row', 200)
    cy.get('[id="store_view"]').contains('mat-row', 800)

    /**
     * For Product_t1_1 enter 50 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 150
     * For Product_t1_2 enter 300 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 500
     */

    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="quantity"]')
      .type('50')
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="save_tray"]')
      .click()
    cy.wait(timeOut.delay_4)

    cy.get('[id="store_view"]').contains('mat-row', 150)

    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="quantity"]')
      .type('300')
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="save_tray"]')
      .click()
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', 500)
    /**
     * Select template 2. validate Product_t2_1 & Product_t2_2 is visible in the Table with
     * Product_t2_1 -> Total_No_of_Quantities = 400 & Product_t2_2 > Total_No_of_Quantities = 700
     * For Product_t2_1 enter 70 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 330
     * For Product_t2_2 enter 600 as the checkin quantity, click on save. Validate the the Total_No_of_Quantities is 100
     */
    cy.get('[id="Switch To Tray View"]').click({ force: true })
    cy.wait(timeOut.delay_4)
    cy.get('[id="Switch To product View"]').click({ force: true })

    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template2).click()
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product1.productname)
      .find('[id="quantity"]')
      .type('70')
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product1.productname)
      .find('[id="save_tray"]')
      .click()
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', 330)

    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product2.productname)
      .find('[id="quantity"]')
      .type('600')
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product2.productname)
      .find('[id="save_tray"]')
      .click()
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', 100)

    /**
     * Click on "Switch To Tray View Button", dropdown should contain only Template1 & 2.
     * tray view is visible with Product_t1_1 with 100 as Quantity and Product_t1_2 with 200 as Quantity.
     */
    cy.get('[id="Switch To Tray View"]').click({force: true})
    cy.wait(timeOut.delay_4)

    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template1)
    cy.get('[id="selectProduct"]').contains(template2).click({force: true})
    cy.wait(timeOut.delay_4)

    cy.get('[id="store_view"]').contains('mat-row', 70)
    cy.get('[id="store_view"]').contains('mat-row', 600)

    /**Navigate to product listing of Template1,
     * validate Product_t2_1 with 200 as Quantity and Product_t2_2 with 800 as Quantity.
     */
    cy.get('[id="dropdown"]').click({force: true})
    cy.get('[id="products"]').contains(template2).click({force: true})

    cy.wait(timeOut.delay_4)
    cy.get('[id="productlisting"]')
      .contains('mat-row', 330)
      .should('be.visible')

    cy.get('[id="productlisting"]')
      .contains('mat-row', 100)
      .should('be.visible')
    cy.logout()
  })
})
/**
 * Checkout Products From Tray
 */
describe('CompanyLogin > CheckOut Product From Tray', () => {
  /**
   * Chekout Product From Tray Template1
   * validate tray view contains template1_product1 > totalQuantities 150
   * validate template1_product2 > totalQuantities 500
   */
  it('ChekOut Products From Tamplate1', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="1"]').contains('Racks').click({force: true})
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .should('be.visible')
    cy.get('[id="racklisting"]')
      .contains('mat-row', updateRackRecord.name)
      .find('[id="view_rack"]')
      .click()
    cy.get('[id="grid"]').contains(rack.rack).click({force: true})
    cy.get('[ id="add_items"]').click()
    cy.wait(timeOut.delay_4)

    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template2)
    cy.get('[id="selectProduct"]').contains(template1).click({force: true})

    cy.get('[id="store_view"]')
      .contains('mat-row', '150')
      .find('[id="updateQuantity"]')
      .should('contain.value', '150')

    cy.get('[id="store_view"]')
      .contains('mat-row', '500')
      .find('[id="updateQuantity"]')
      .should('contain.value', '500')
    /**
     * CheckOut template1_product1 50 Validate totalQuantites 100
     * CheckOut template1_product2 100 Validate totalQuantites 400
     */
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="updateQuantity"]')
      .clear()
      cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="updateQuantity"]')
      .type('50')
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product1.productname)
      .find('[id="save_tray"]')
      .click({ force: true })
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', '100')

    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="updateQuantity"]')
      .clear()
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="updateQuantity"]')
      .type('100')
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template1_Product2.productname)
      .find('[id="save_tray"]')
      .click({ force: true })
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', '400')
  })

  /**
   * Checkout product from Template2
   */
  it('ChekOut Products From Tamplate2', () => {
    cy.get('[id="product-dropdownMenu"]').click({force: true})
    cy.get('[id="selectProduct"]').contains(template2).click({force: true})

    /**
     * Validate template2_product1 > TotalQuantities -> 330
     * Validate template2_product2 > TotalQuantities -> 100
     */
    cy.get('[id="store_view"]')
      .contains('mat-row', '70')
      .find('[id="updateQuantity"]')
      .should('contain.value', '70')

    cy.get('[id="store_view"]')
      .contains('mat-row', '600')
      .find('[id="updateQuantity"]')
      .should('contain.value', '600')

    /**
     * CheckOut template2_product1 30 Validate totalQuantites 300
     * CheckOut template2_product2 50 Validate totalQuantites 50
     */

    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product1.productname)
      .find('[id="updateQuantity"]')
      .clear()
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product1.productname)
      .find('[id="updateQuantity"]')      
      .type('30')
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product1.productname)
      .find('[id="save_tray"]')
      .click({ force: true })
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', '40')

    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product2.productname)
      .find('[id="updateQuantity"]')
      .clear()
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product2.productname)
      .find('[id="updateQuantity"]')
      .type('50')
    cy.wait(timeOut.delay_2)
    cy.get('[id="store_view"]')
      .contains('mat-row', template2_Product2.productname)
      .find('[id="save_tray"]')
      .click({ force: true })
    cy.wait(timeOut.delay_4)
    cy.get('[id="store_view"]').contains('mat-row', '550')
    cy.logout()
  })
})
