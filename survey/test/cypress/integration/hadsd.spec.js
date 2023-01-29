/// <reference types="cypress" />

context('About page', () => {

  // const sizes = ['iphone-6', 'ipad-2', [1024, 768]]
  const sizes = ['ipad-2']

  sizes.forEach((size) => {

    it('Checks HADSD', () => {
      if (typeof size === 'string') cy.viewport(size)
      else cy.viewport(size[0], size[1])

      cy.visit('http://localhost:8080/#/quest/hadsd')

      // ENTER PID
      cy.get('[data-cy=PID]').should('exist').type('test')

      // FILL ALL FORMS
      cy.get('[data-cy=number]').type('123')
      cy.get('[data-cy=radio]').each(el => {
        cy.wrap(el).children().find('.q-radio').first().click()
      })
      
      cy.get('[data-cy=submitquest]').should('exist').click()
      // cy.get('[data-cy=check_error_banner]').should('not.exist')
      cy.get('[data-cy=check_sucess]').should('exist')

    })
  }) //end for

})