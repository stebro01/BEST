describe('Test Presets', () => {

  it('preset/ reroutes to selectquest', () => {
    cy.viewport(1024, 768)
    cy.visit('/#/preset/')
    cy.get('[data-cy=selectquest]').should('exist')

  })

  it('create a preset and fill it completely', () => {
    cy.viewport(1024, 768)
    // cy.viewport('iphone-x')

    cy.visit('/#/preset/')

    // SELECT 3 QUESTS
    cy.get('[data-cy=questlist2]').click()
    cy.get('[data-cy=questlist3]').click()
    cy.get('[data-cy=questlist5]').click()
    
    // CREATE THE PRESET
    cy.get('[data-cy=btn_gotopreset]').click()
    cy.get('[data-cy=PID]').type(Date.now().toString())

    // START THE QUEST
    cy.get('[data-cy=btn_preset_start]').click()
    

    // AUTO FILL BDI2
    cy.get('[data-cy=quest_title]').contains('BDI 2')
    cy.window().its('_store').then(store => {
      store.state.debug = true
    })
    cy.get('[data-cy=btn_options]').click()
    cy.get('[data-cy=random_fill]').click()
    cy.get('[data-cy=submitquest]').click()

    // AUTO FILL BFI
    cy.get('[data-cy=quest_title]').contains('BFI')
    cy.get('[data-cy=btn_options]').click()
    cy.get('[data-cy=random_fill]').click()
    cy.get('[data-cy=submitquest]').click()

    // AUTO FILL BSI
    cy.get('[data-cy=quest_title]').contains('BSI')
    cy.get('[data-cy=btn_options]').click()
    cy.get('[data-cy=random_fill]').click()
    cy.get('[data-cy=submitquest]').click()

    // FINISHED PAGE
    cy.get('[data-cy=page_finished]').should('exist')
    cy.get('[data-cy=btn_options]').click()
    cy.get('[data-cy=back_root]').click()
    // go the results
    cy.get('[data-cy=main_drawer]').click()
    cy.get('[data-cy=link_Storage]').click()

    // PRINT STORAGE TO THE CONSOLE
    cy.get('[data-cy=btn_debug_print]').click()

  })


})

