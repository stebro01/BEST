/// <reference types="cypress" />

context('create a quest', () => {

  const size = 'ipad-2'

    it('Adds an item > number', () => {
      cy.viewport(size)
      cy.visit('/#/questman/create')

      // ADD A ITEM > number
      cy.get('[data-cy=btn_description]').should('exist').click()
      cy.get('[data-cy=quest_title]').clear().type('Fragebogen TEST01')
      cy.get('[data-cy=btn_description]').click()

      cy.get('[data-cy=btn_items]').should('exist').click()
      cy.get('[data-cy=btn_items_add]').should('exist').click()
      cy.get('[data-cy=item_expanse_0]').should('exist').click()
      cy.get('[data-cy=item_label_0]').should('exist').clear()
      cy.get('[data-cy=item_label_0]').type('Wie alt sind sie?')
      
      cy.window().its('_store').then(store => {
        const quest = store.state.editquest
        quest.items[0].type = 'radio'
        quest.items[0].options = []

      })

      // cy.get('[data-cy=btn_preview]').click()

    })

})