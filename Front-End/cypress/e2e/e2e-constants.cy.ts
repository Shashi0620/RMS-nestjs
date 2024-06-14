/* eslint-disable no-undef */
import {faker} from '@faker-js/faker'

export let rack = {
  rack: 'r0c0'
}

export let userData = {
  clientFk: 0
}

export const companyAdmin = {
  username: 'adarash_admin',
  pwd: 'cybis@ban'
}

export const companyAdmin2 = {
  username: 'adarash_admin',
  pwd: 'cybis@ban'
}

export const userAdmin = {
  username: faker.lorem.word() + 'Admin' + Math.floor(Math.random() * 1000),
  email:
    faker.lorem.word() + Math.floor(Math.random() * 1000) + '@electems.com',
  password: 'cybis@ban',
  confirmPassword: 'cybis@ban',
  phone: Math.floor(Math.random() * 10000000000),
  location: faker.lorem.word()
  // plan: 'Company/Traders'
}

export const password = {
  password: 'cybis@ban',
  confirmpassword: 'cybis@ban'
}
export const passwordMismatch = {
  password: 'company2',
  confirmpassword: 'company'
}

export const staffRecord = {
  Username:
    faker.lorem.word() + '-staffName' + Math.floor(Math.random() * 1000),
  Email: faker.lorem.word() + '-staffName' + '@electems.com',
  Password: 'cybis@ban',
  ConfirmPassword: 'cybis@ban'
}

export const updateStaffRecord = {
  Username:
    faker.lorem.word() + '-staffName' + Math.floor(Math.random() * 1000),
  Email: faker.lorem.word() + '-staffName' + '@electems.com',
  Password: 'cybis@ban',
  ConfirmPassword: 'cybis@ban'
}

export const staffRecord2 = {
  Username:
    faker.lorem.word() + '-staff2Name' + Math.floor(Math.random() * 1000),
  Email: faker.lorem.word() + '-staff2Name' + '@electems.com',
  Password: 'cybis@ban',
  ConfirmPassword: 'cybis@ban'
}

export const staffRecord3 = {
  Username:
    faker.lorem.word() + '-staffName' + Math.floor(Math.random() * 10000),
  Email:
    faker.lorem.word() + Math.floor(Math.random() * 10000) + '@electems.com',
  Password: 'cybis@ban',
  ConfirmPassword: 'cybis@ban'
}

export const storeRecord = {
  StoreName: faker.lorem.word() + '-storeName',
  Address: faker.lorem.word(),
  latitude: Math.floor(Math.random() * 10000000000),
  longitude: Math.floor(Math.random() * 10000000000)
}

export const updateStoreRecord = {
  StoreName: faker.lorem.word() + '-storeName',
  Address: faker.lorem.word(),
  latitude: Math.floor(Math.random() * 10000000000),
  longitude: Math.floor(Math.random() * 10000000000)
}

export const notificationSettingRecord = {
  NotificationName: faker.lorem.word(),
  Email: faker.lorem.word() + '@electems.com'
}

export const updatenotificationSettingRecord = {
  NotificationName: faker.lorem.word(),
  Email: faker.lorem.word() + '@electems.com'
}

export const environment = {
  baseUrl: 'http://localhost:3000',
  frontendBaseUrl: 'http://localhost:3000'
}

export const rackRecord = {
  name: faker.lorem.word() + '-rackName',
  noOfRows: 4,
  noOfColumns: 5,
  store: updateStoreRecord.StoreName
}

export const updateRackRecord = {
  name: faker.lorem.word() + '-rackName',
  noOfRows: 3,
  noOfColumns: 3,
  store: 'Walmart'
}

export const translateValues = {
  staff: 'StaffCheck',
  rack: 'RacksCheck',
  store: 'StoreCheck',
  product: 'ProductCheck'
}

export const addproduct = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const addproductForTimeInterval = {
  quantity: 20,
  productname: faker.commerce.product() + '-product1Name',
  weight: faker.datatype.number()
}

export const addproductForTimeInterval2 = {
  quantity: 20,
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const template1_Product1 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-temp1product1Name',
  weight: faker.datatype.number()
}

export const template1_Product2 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-temp1product2Name',
  weight: faker.datatype.number()
}

export const template2_Product1 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-temp2product1Name',
  weight: faker.datatype.number()
}

export const template2_Product2 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-temp2product2Name',
  weight: faker.datatype.number()
}

export const addproduct2 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const addproduct3 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const addproduct4 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const addproduct5 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const addproduct6 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const addproduct7 = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName',
  weight: faker.datatype.number()
}

export const updateProduct = {
  quantity: Math.floor(Math.random() * 1000),
  productname: faker.commerce.product() + '-productName'
}

export const selectTemplate = {
  template: 'Product_2_' + userAdmin.username
}

export const timeOut = {
  delay_1: 1000,
  delay_2: 2000,
  delay_3: 3000,
  delay_4: 4000,
  delay_5: 10000
}

export const testRackRecord = {
  name: faker.lorem.word() + '-rackName',
  noOfRows: 4,
  noOfColumns: 4
}
export const testRackRecord2 = {
  name: faker.lorem.word() + '-rackName',
  noOfRows: 4,
  noOfColumns: 4,
  store: 'provident-storeName'
}
export const testUpdateRackRecord = {
  name: faker.lorem.word() + '-rackName',
  noOfRows: 5,
  noOfColumns: 5,
  store: 'Store-1'
}
export const rackSelect = {
  rackName: 'r1c1',
  rackRename: 'r1c1'
}
export const createQuantity = {
  quantity: '200'
}

export const selectProduct = {
  product: 'Product_2_' + userAdmin.username
}
export const updateQuantity = {
  updateQuantity: '20'
}
export const tray = {
  tray: 'r1c1',
  tray2: 'r2c2'
}

export const selectNotification = {
  notification: 'notification new'
}
export const testStoreRecord = {
  StoreName: faker.lorem.word() + '-storeName',
  Address: faker.lorem.word(),
  latitude: Math.floor(Math.random() * 10000000000),
  longitude: Math.floor(Math.random() * 10000000000)
}
export const testStoreRecord2 = {
  StoreName: faker.lorem.word() + '-storeName',
  Address: faker.lorem.word(),
  latitude: Math.floor(Math.random() * 10000000000),
  longitude: Math.floor(Math.random() * 10000000000)
}
export const template = {
  templateName: 'Product_2_' + +userAdmin.username,
  changedTemplateName: faker.lorem.word()
}
export const templateRecord = {
  quantity: '1000',
  oldTextField: faker.lorem.word(),
  newEmailField: faker.lorem.word() + '@electems.com',
  newTextField: faker.lorem.word()
}
export const templateRecord2 = {
  quantity: '500',
  oldTextField: faker.lorem.word(),
  newEmailField: faker.lorem.word() + '@electems.com',
  newTextField: faker.lorem.word()
}
export const templateRecord3 = {
  quantity: '600',
  oldTextField: faker.lorem.word(),
  newEmailField: faker.lorem.word() + '@electems.com',
  newTextField: faker.lorem.word()
}
export const templateRecord4 = {
  quantity: '400',
  oldTextField: faker.lorem.word(),
  newEmailField: faker.lorem.word() + '@electems.com',
  newTextField: faker.lorem.word()
}
export const contactus = {
  Username: faker.lorem.word() + '-username',
  Message: faker.lorem.lines(1)
}

export const notificationSettingData = {
  NotificationName: faker.lorem.word() + '-notification',
  Email: faker.lorem.word() + '@electems.com',
  noOfReminders: 1,
  timeINterval: 1,
  NotificationName2: faker.lorem.word() + '-notification',
  Email2: faker.lorem.word() + '@electems.com',
  noOfReminders2: 2,
  timeINterval2: 2,
  NotificationName3: faker.lorem.word() + '-notification',
  Email3: faker.lorem.word() + '@electems.com',
  noOfReminders3: 3,
  timeINterval3: 3
}

export const setQuantityUpperAndLowerLimit = {
  quantity: '6',
  lowerLimit: '5',
  upperLimit: '225'
}

export const setQuantityUpperAndLowerLimit1 = {
  quantity: '12',
  lowerLimit: '5',
  upperLimit: '10'
}

export const setQuantityUpperAndLowerLimit2 = {
  quantity: '4',
  lowerLimit: '3',
  upperLimit: '20'
}
