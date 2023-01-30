
context('Main Routes exist', () => {

    it('Indexpage', () => {
      // cy.viewport(1024, 768)
      cy.viewport('iphone-6')

      cy.visit('/#/select')
      // cy.get('[data-cy=page_index]').should('exist')
      // cy.get('[data-cy=btn_quest]').should('exist')
      // cy.get('[data-cy=btn_presets]').should('exist')
    })

    // it('About page', () => {
    //   cy.viewport(1024, 768)
    //   cy.visit('/#/about')
    //   cy.get('[data-cy=page_about]').should('exist')
    // })

    // it('Settings page', () => {
    //   cy.viewport(1024, 768)
    //   cy.visit('/#/settings')
    //   cy.get('[data-cy=page_settigns]').should('exist')
    // })

})