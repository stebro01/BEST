
context('TEST the QUESTS', () => {

    it('make all qeusts', async () => {
      cy.viewport(1024, 768)

      cy.visit('/#/select')
      cy.get('[data-cy=selectquest]').should('exist')

      cy.window().its('_store').then(store => {
        store.state.debug = true
      })
  
      cy.get('[data-cy=questlistRoot]').children().then(el => {
        for (let i = 0; i < el.length; i++) {
          cy.get(`[data-cy=questlist${i}]`).click()
          cy.get('[data-cy=btn_gotoquest]').click()
          cy.get('[data-cy=btn_options]').click()
          cy.get('[data-cy=random_fill]').click()
          cy.get('[data-cy=submitquest]').click()
          cy.get('[data-cy=page_finished]').should('exist')
          cy.visit('/#/select')
        }
      })
      
      // go the results
      cy.visit('/')
      cy.window().its('_store').then(store => {
        store.state.leftDrawerOpen = true
        store.state.debug = true
      })
      cy.get('[data-cy=link_Storage]').click()

      // PRINT STORAGE TO THE CONSOLE
      cy.get('[data-cy=btn_debug_print]').click()
      
    })

})

