/// <reference types="cypress" />

context('About page', () => {

  // const sizes = ['iphone-6', 'ipad-2', [1024, 768]]

    beforeEach(() => {
      // cy.viewport('ipad-2')
      cy.viewport(1000, 600)
      cy.visit('#/storage')

      cy.window().its('_store').then(store => {
        store.state.STORAGE._STORAGE = JSON.parse(JSON.stringify(all_quest.STORAGE))//deep copy object
      })

    })

    // DELETE
    it('Test basic functions - delete', () => {
      // 30 ENTREIS should be availabel
      cy.get('[data-cy=items]').children().should('have.length', '30')
      
      // DELETE SOME ENTRIES
      cy.get('[data-cy=check_0]').click()
      cy.get('[data-cy=item_0]').should('exist')

      cy.get('[data-cy=btn_remove_all]').click()
      cy.get('[data-cy=items]').children().should('have.length', '29')

      // DELETE more ENTRIES
      cy.get('[data-cy=check_0]').click()
      cy.get('[data-cy=check_10]').click()
      cy.get('[data-cy=check_20]').click()
      cy.get('[data-cy=btn_remove_all]').click()
      cy.get('[data-cy=items]').children().should('have.length', '26')

      // REMOVE SOME ENTRIES WITH CARD BUTTON
      cy.get('[data-cy=btn_remove_10]').click()
      cy.get('[data-cy=btn_remove_10]').click()
      cy.get('[data-cy=btn_remove_10]').click()
      cy.get('[data-cy=items]').children().should('have.length', '23')

      // REMOVE ALL
      cy.get('[data-cy=btn_select_all]').click()
      cy.get('[data-cy=btn_remove_all]').click()
      cy.get('[data-cy=items]').children().should('have.length', '0')
      cy.get('[data-cy=btns_select]').should('not.exist')
      cy.get('[data-cy=no_entry]').should('exist')

    })

    // EXPORT
    it('Test basic functions - export badge - single', () => {
      // EXPORT und CHECK BADGE
      cy.get('[data-cy=exported_0]').should('not.exist')
      cy.get('[data-cy=file_download_0]').click()
      cy.get('[data-cy=exported_0]').should('exist')
    })

    it('Test basic functions - export badge - multiple', () => {
      // EXPORT und CHECK BADGE
      cy.get('[data-cy=exported_0]').should('not.exist')
      cy.get('[data-cy=exported_10]').should('not.exist')
      cy.get('[data-cy=exported_20]').should('not.exist')
      cy.get('[data-cy=check_0]').click()
      cy.get('[data-cy=check_10]').click()
      cy.get('[data-cy=check_20]').click()
      cy.get('[data-cy=btn_export_all]').click()
      cy.get('[data-cy=exported_0]').should('exist')
      cy.get('[data-cy=exported_10]').should('exist')
      cy.get('[data-cy=exported_20]').should('exist')
    })

    // TEST NOTION EXPORT
    it('Test basic functions - export to notion', () => {
      // EXPORT und CHECK BADGE
      cy.visit('/#/settings')
      cy.get('[data-cy=notion_use]').click()
      cy.get('[data-cy=notion_input_db]').type('https://www.notion.so/98b5242cdd734f92902af5d8a59976e1?v=8a95249a47704b428e4ead061f318b70')
      cy.get('[data-cy=notion_input_token]').type('secret_Aj82oDGkp6lUL7tPpGru22izDDFiNkquMRK1Cw5DNwv')

      // GOTO SETTINGS
      cy.visit('#/storage')

      // // Export Alltagsaktivitäten
      // cy.get('[data-cy=exported_0]').should('not.exist')
      // cy.get('[data-cy=export_cloud_0]').click()
      // cy.get('[data-cy=exported_0]').should('exist')

      // // Export BADL
      // cy.get('[data-cy=exported_1]').should('not.exist')
      // cy.get('[data-cy=export_cloud_1]').click()
      // cy.get('[data-cy=exported_1]').should('exist')

    })

        it('Test basic functions - export all', () => {
      // EXPORT und CHECK BADGE
      cy.visit('/#/settings')
      cy.get('[data-cy=notion_use]').click()
      cy.get('[data-cy=notion_input_db]').type('https://www.notion.so/98b5242cdd734f92902af5d8a59976e1?v=8a95249a47704b428e4ead061f318b70')
      cy.get('[data-cy=notion_input_token]').type('secret_Aj82oDGkp6lUL7tPpGru22izDDFiNkquMRK1Cw5DNwv')

      // GOTO SETTINGS
      cy.visit('#/storage')

      cy.get('[data-cy=items]').children().then(el => {
        for (let i = 0; i<el.length; i++) {
          cy.get(`[data-cy=exported_${i}]`).should('not.exist')
          cy.get(`[data-cy=export_cloud_${i}]`).click()
          cy.get(`[data-cy=exported_${i}]`).should('exist')
        }
      })


    })
})

// SOME DATA
const all_quest = require('../../mockdata/all_quests_30.json')

