/// <reference types="cypress" />

context('About page', () => {

    // const sizes = ['iphone-6', 'ipad-2', [1024, 768]]
    const sizes = ['ipad-2']
  
    sizes.forEach((size) => {
  
  
  
      it('Checks form', () => {
        if (typeof size === 'string') cy.viewport(size)
        else cy.viewport(size[0], size[1])
  
        cy.visit('http://localhost:8080/#/select')
        cy.get('[data-cy=quest_0]').should('exist').click()
        cy.get('[data-cy=gotoquest]').should('exist').click()
  
        // FILL ALL FORMS
        cy.get('[data-cy=PID]').should('exist').type('test')
        cy.get('[data-cy=item_entry]').each((el, index, $list) => {
          cy.wrap(el[0].children[3]).wait(100).click()
        })
  
        cy.get('[data-cy=submitquest]').should('exist').click()
        cy.get('[data-cy=selectquest]').should('exist')
  
      })
    }) //end for
  
  })