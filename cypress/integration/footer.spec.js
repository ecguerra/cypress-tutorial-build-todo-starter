/// <reference types="Cypress" />

describe('Footer', ()=>{
    context('with a single todo', ()=>{
        it('displays a singular todo in count', ()=>{
            cy.seedAndVisit([{id: 1, name: 'Buy Milk', isComplete: false}])
            cy.get('.todo-count')
              .should('contain', '1 todo left')
        })
    })

    context('with multiple todos', ()=>{
        beforeEach(()=>{
            cy.seedAndVisit()
        })

        it('displays plural todos in count', ()=>{
            cy.get('.todo-count')
              .should('contain', '3 todos left')
        })

        it.only('handles filter links', ()=>{
            const filters = [                   // for when there's very similar code with different parameters
                {link: 'Active', expectedLength: 3},
                {link: 'Completed', expectedLength: 1},
                {link: 'All', expectedLength: 4},
            ]
            cy.wrap(filters)
              .each(filter => {                 // basically a forEach call
                  cy.contains(filter.link)
                    .click()
      
                  cy.get('.todo-list li')
                    .should('have.length', filter.expectedLength)
              }) 
        })

    })
})