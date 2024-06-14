describe('Login Modal Test Cases', () => {
  it('Login Modal', () => {
    cy.get('[id="login-button"]').click()
    cy.get('[id="feedbackModalLabel"]').contains(' User Login ')
    cy.get('[class="modal-content"]').contains('Forgot password? Reset')
    cy.get('[class="modal-content"]').contains("Don't have an account? Sign up")
  })

  it('ForgotPassword Modal', () => {
    cy.get('[id="forgotpassword"]').contains('Reset').click()
    cy.get('[id="feedbackModalLabel"]').contains(' Forgot Password ')
    cy.get('[id="Recoveraccess"]').contains(' Recover access ')
    cy.get('[class="mt-3 text-center"]').contains(' Don’t have an account? ')
    cy.get('[id="signup"]').contains('Sign up').click()
  })

  it('Sign up Modal', () => {
    cy.get('[id="feedbackModalLabel"]').contains(' Register Form ')
    cy.get('[id="registerForm"]').contains(
      ' Please enter your email, username, and password to Sign up '
    )
    cy.get('[id="login"]').contains('Login').click({multiple: true})
    cy.get('[id="feedbackModalLabel"]').contains(' User Login ')
    cy.get('[class="modal-content"]').contains('Forgot password? Reset')
    cy.get('[class="modal-content"]').contains("Don't have an account? Sign up")
  })
})
