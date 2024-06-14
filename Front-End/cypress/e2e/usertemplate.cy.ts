/* eslint-disable i18n-text/no-en */
/* eslint-disable filenames/match-regex */
/* eslint-disable check-file/filename-naming-convention */
describe('UsertemplateSectionTest', () => {
  it('UserTemplate', () => {
    cy.visit('/template')
    cy.get('[class="dropdown-toggle"]').click()
    cy.get('[class="btn btn-primaryy rounded-pill px-3 mb-2 mb-lg-0"]')
      .contains('item4')
      .click()
    cy.contains('button', 'Add new Product').click()
    cy.contains('button', 'Cancel').click()
  })
})
