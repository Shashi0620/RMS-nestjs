/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
/* eslint-disable filenames/match-regex */
import {faker} from '@faker-js/faker'
import {
  userAdmin,
  updateStaffRecord,
  notificationSettingData,
  setQuantityUpperAndLowerLimit,
  setQuantityUpperAndLowerLimit1,
  setQuantityUpperAndLowerLimit2,
  timeOut,
  staffRecord,
  addproductForTimeInterval,
  addproductForTimeInterval2,
  updateRackRecord,
  updateStoreRecord
} from './e2e-constants.cy'
import {environment} from 'src/environments/environment'
//const email = 'druthvik@electems.com'

let token = ''
// userAdmin.username = 'ShashiAdmin'
// userAdmin.password = 'cybis@ban'
// updateStaffRecord.Username = 'iste-staffName894'
// updateStaffRecord.Password = 'cybis@ban'


const templateName = 'Product 7 ' + userAdmin.username

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

describe('Notification TimeInterval', () => {

  it('Add Product1 to template', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.get('[id="dropdown"]').click({ force: true })
    cy.get('[id="products"]')
      .contains(templateName.replace(/_/g, ' '))
      .click({ force: true })
    cy.get('[id="productname"]').contains(templateName)
    cy.get('[id="add_product"]').click({ force: true })
    cy.wait(timeOut.delay_4)
    cy.get('[id="Product_quantity"]').type(addproductForTimeInterval.quantity.toString())
    cy.get('[type="text"]').type(addproductForTimeInterval.productname)
    cy.get('[id="Product_quantity"]').clear()
    cy.get('[id="Product_quantity"]').type(addproductForTimeInterval.quantity.toString())
    cy.get('[id="save_product"]').click({ force: true })
    cy.wait(timeOut.delay_2)
    cy.get('[id="productlisting"]')
      .contains('mat-row', addproductForTimeInterval.quantity)
      .should('be.visible')
    cy.wait(timeOut.delay_2)
  })
  // 1st
  it('TimeInterval is One and noOfReminders is One Setting product to lower limit', () => {
   

    cy.notificationSetting(
      notificationSettingData.NotificationName,
      notificationSettingData.Email,
      notificationSettingData.noOfReminders,
      notificationSettingData.timeINterval,
      updateStoreRecord.StoreName
    )
    cy.logout()
    //3. Login as updateStaffRecord
    cy.login(updateStaffRecord.Username, updateStaffRecord.Password)
    let firstCount: number


    cy.wait(timeOut.delay_2)
    cy.quantityLowerLimitHigherLimitSet(
      setQuantityUpperAndLowerLimit.quantity,
      setQuantityUpperAndLowerLimit.lowerLimit,
      setQuantityUpperAndLowerLimit.upperLimit,
      notificationSettingData.NotificationName,
      addproductForTimeInterval.productname,
      updateRackRecord.name,
      userAdmin.username
    )
    cy.wait(timeOut.delay_3)

    // initial count should be zero
    cy.task(
      'connectDB',
      `SELECT COUNT(*) FROM notifications Where email='${notificationSettingData.Email}'`
    ).then(queryResponse => {
      firstCount = queryResponse[0].count
    })

    // Auth URL
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

    // send mail URL

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

    // AFter record inderted  count should be 1
    let secondCount: number

    cy.task(
      'connectDB',
      `SELECT COUNT(*) FROM notifications Where email='${notificationSettingData.Email}' AND  status = 'NEW'`
    ).then(queryResponse => {
      secondCount = queryResponse[0].count
    })
    
// insert  notification URL
    cy.request({
      method: 'GET',
      url: environment.baseUrl + '/api/trayItem/calculateEscalationBasedAlertConfiguration',
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

    let thirdCount: number
    //update query to set status to sent
    cy.task(
      'connectDB',
      `UPDATE notifications
      SET status = 'SENT', 
      "noOfRemainder" = ${notificationSettingData.noOfReminders - 1},
      "updatedAt" = NOW()
      WHERE email = '${notificationSettingData.Email}'`
    ).then(queryResponse => {
      console.log(queryResponse[0])
    })
    cy.task(
      'connectDB',
      `SELECT 
      COUNT(*) 
    FROM 
      notifications 
    Where 
      email = '${notificationSettingData.Email}' 
      and "status" = 'SENT'`
    ).then(queryResponse => {
      thirdCount = queryResponse[0].count
    })

    cy.logout()
  })
  // it('Add Product2 to template', () => {
  //   cy.get('[id="add_product"]').click({ force: true })
  //   cy.wait(timeOut.delay_4)
  //   cy.get('[id="Product_quantity"]').type(addproductForTimeInterval2.quantity.toString())
  //   cy.get('[type="text"]').type(addproductForTimeInterval2.productname)
  //   cy.get('[id="Product_quantity"]').clear()
  //   cy.get('[id="Product_quantity"]').type(addproductForTimeInterval2.quantity.toString())
  //   cy.get('[id="save_product"]').click({ force: true })
  //   cy.wait(timeOut.delay_2)
  //   cy.get('[id="productlisting"]')
  //     .contains('mat-row', addproductForTimeInterval2.quantity)
  //     .should('be.visible')
  //   cy.wait(timeOut.delay_2)
  // })

  // 2nd
  it('Set timeInterval to Two and noOfReminders to Two and setting product to upperlimit', () => {
    //3. Login as updateStaffRecord
    cy.login(userAdmin.username, userAdmin.password)

    cy.notificationSetting(
      notificationSettingData.NotificationName2,
      notificationSettingData.Email2,
      notificationSettingData.noOfReminders2,
      notificationSettingData.timeINterval2,
      updateStoreRecord.StoreName
    )
    cy.logout()
    //3. Login as updateStaffRecord
    cy.login(updateStaffRecord.Username, updateStaffRecord.Password)
    let firstCount: number

    // initial count should be 0
    cy.task(
      'connectDB',
      `SELECT COUNT(*) FROM notifications Where email='${notificationSettingData.Email2}' 
      AND "notificationType" = 'QUANTITY-ALERT'`
    ).then(queryResponse => {
      firstCount = queryResponse[0].count
    })
    cy.wait(timeOut.delay_2)
    cy.quantityLowerLimitHigherLimitSet2(
      setQuantityUpperAndLowerLimit1.quantity,
      setQuantityUpperAndLowerLimit1.lowerLimit,
      setQuantityUpperAndLowerLimit1.upperLimit,
      notificationSettingData.NotificationName2,
      updateRackRecord.name,
      userAdmin.username
    )
    cy.wait(timeOut.delay_3)
    let secondCount: number

    // after record is inserted count should be 1
    cy.task(
      'connectDB',
      `SELECT COUNT(*) FROM notifications Where email='${notificationSettingData.Email2}' 
      AND "notificationType" = 'QUANTITY-ALERT'`
    ).then(queryResponse => {
      secondCount = queryResponse[0].count
    })
    let thirdCount: number

    //update query to set status to sent
    cy.task(
      'connectDB',
      `UPDATE notifications
      SET status = 'SENT', 
      "noOfRemainder" = ${notificationSettingData.noOfReminders2 - 1},
      "updatedAt" = CURRENT_DATE + INTERVAL '2 days'
      WHERE email = '${notificationSettingData.Email2}' AND 
      "notificationType" = 'QUANTITY-ALERT'`
    ).then(queryResponse => {
      console.log(queryResponse[0])
    })

    // after 1st mail sent count should be one and noOfRemainder should be 1
    cy.task(
      'connectDB',
      `SELECT 
      COUNT(*) 
    FROM 
      notifications 
    Where 
      email = '${notificationSettingData.Email2}' 
      and "status" = 'SENT' 
      and "noOfRemainder" = 1
      AND "notificationType" = 'QUANTITY-ALERT'`
    ).then(queryResponse => {
      thirdCount = queryResponse[0].count
    })
  
    cy.task(
      'connectDB',
      `UPDATE notifications
      SET status = 'SENT', 
      "noOfRemainder" = ${notificationSettingData.noOfReminders2 - 1},
      "updatedAt" = NOW()
      WHERE email = '${notificationSettingData.Email2}'
      AND "notificationType" = 'QUANTITY-ALERT'`
    ).then(queryResponse => {
      console.log(queryResponse[0])
    })

    // after 2nd mail sent count should be one and noOfRemainder should be 0
    let fourthCount: number
    cy.task(
      'connectDB',
      `SELECT 
      COUNT(*) 
    FROM 
      notifications 
    Where 
      email = '${notificationSettingData.Email2}' 
      and "status" = 'SENT' 
      and "noOfRemainder" = 0
      AND "notificationType" = 'QUANTITY-ALERT'`
    ).then(queryResponse => {
      fourthCount = queryResponse[0].count
    })
    // cy.get('button').then(() => {
    //   expect(fourthCount).to.eq(1)
    // })

    cy.logout()
  })
})
