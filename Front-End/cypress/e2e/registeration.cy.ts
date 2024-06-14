/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable github/no-then */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */
/* eslint-disable i18n-text/no-en */
/* eslint-disable filenames/match-regex */
/* eslint-disable no-console */
import {environment, userAdmin, userData} from './e2e-constants.cy'

describe('Register > ComanyAdmin', () => {
  it('registration', () => {
    cy.registration(
      userAdmin.username,
      userAdmin.email,
      userAdmin.password,
      userAdmin.confirmPassword,
      userAdmin.phone,
      userAdmin.location
    )
  })
  it('Activation', () => {
    cy.task(
      'connectDB',
      `SELECT * FROM users WHERE username='${userAdmin.username}'`
    ).then(response => {
      console.log(response)
      userData.clientFk = response[0].clientFk
      const id = response[0].id
      cy.request(
        `${environment.baseUrl}/api/user/activation/${userData.clientFk}/${id}`
      )
    })
  })
  it('Login', () => {
    cy.login(userAdmin.username, userAdmin.password)
    cy.visit('/template')
    cy.logout()
  })
})

// describe('Register > Distributor', () => {
//   it('registration', () => {
//     cy.registration(
//       createUserDistributor.username,
//       createUserDistributor.email,
//       createUserDistributor.password,
//       createUserDistributor.confirmPassword,
//       createUserDistributor.phone,
//       createUserDistributor.location,
//       createUserDistributor.plan
//     )
//
//   })
//   it('Activation', () => {
//     cy.task('connectDB', {
//       query: `SELECT * FROM users WHERE username='${createUserDistributor.username}' `
//     }).then(response => {
//       console.log(response)
//       const id = response[0].id
//       const clientFk = response[0].clientFk
//       cy.request(`http:localhost:3000/api/user/activation/${clientFk}/${id}`)
//     })
//   })
//   it('Login', () => {
//     cy.login(createUserDistributor.username, createUserDistributor.password)
//     cy.visit('/template')
//     cy.logout()
//   })
// })

// describe('Register > Personal', () => {
//   it('registration', () => {
//     cy.registration(
//       createUserPersonal.username,
//       createUserPersonal.email,
//       createUserPersonal.password,
//       createUserPersonal.confirmPassword,
//       createUserPersonal.phone,
//       createUserPersonal.location,
//       createUserPersonal.plan
//     )
//
//   })
//   it('Activation', () => {
//     cy.task('connectDB', {
//       query: `SELECT * FROM users WHERE username='${createUserPersonal.username}' `
//     }).then(response => {
//       console.log(response)
//       const id = response[0].id
//       const clientFk = response[0].clientFk
//       cy.request(`http:localhost:3000/api/user/activation/${clientFk}/${id}`)
//     })
//   })
//   it('Login', () => {
//     cy.login(createUserPersonal.username, createUserPersonal.password)
//     cy.visit('/template')
//     cy.logout()
//   })
// })
