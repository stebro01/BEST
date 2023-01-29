
context('TEST the QUESTS', () => {
    const testName = 'WHOQOL-BREF'
    it('Select a Quest', () => {
      cy.viewport(1024, 768)

      cy.visit('/')
      cy.get('[data-cy=page_index]').should('exist')
      cy.get('[data-cy=btn_quest]').should('exist').click()
      // set filter
      cy.dataCy('filter_btn').click()
      cy.dataCy('filter_input').clear().type(testName)
      // elect first quest in list
      cy.dataCy('questlist0').click()
      cy.dataCy('btn_gotoquest').click()
      // AUTO FILL
      cy.dataCy('PID').clear().type('DEMO')
      cy.dataCy('btn_hidden_options').click()
      cy.dataCy('btn_random_fill').click()
      // //submit
      // cy.dataCy('submitquest').click()

      // // goto storage
      // cy.visit('/#/storage')

      // ENDE
    })

    
})

