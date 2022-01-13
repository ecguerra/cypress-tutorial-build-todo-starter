/// <reference types="Cypress" />

// Other spec pages (integration tests) used stub network requests - allows testing of front end without needing back end
// Also allows for testing network errors & other edge cases
// Integration tests should make up majority of tests
// This file will be E2E tests - make sure app works through each layer, with back end connected
// For simplicity/lightweight - focus on happy path types and each network request
// 1 test each for GET, POST, PUT, DELETE

// to run all tests headless, add "cypress:all": "cypress run" to scripts in package.json
// then npm run cypress:all to see outputs in terminal

describe('Smoke tests', ()=>{
  beforeEach(()=>{
    cy.request('GET', '/api/todos')
      .its('body')
      .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
  }) // starts us with an empty DB // not the most efficient method, look into other options

  context('With no todos', ()=>{
    it('Saves new todos', ()=>{
      const items = [
        {text: 'Buy milk', expectedLength: 1},
        {text: 'Buy eggs', expectedLength: 2},
        {text: 'Buy bread', expectedLength: 3},
      ]
      cy.visit('/')
      cy.server()
      cy.route('POST', '/api/todos')
        .as('create')
      
      cy.wrap(items)
        .each(todo => {
          cy.focused()
            .type(todo.text)
            .type('{enter}')
    
          cy.wait('@create') // tells cypress we're making a POST request and to wait for the response until continuing test
          
          cy.get('.todo-list li')
            .should('have.length', todo.expectedLength)
        })
    })
  })
  
  context('With active todos', ()=>{
    beforeEach(()=>{
      cy.fixture('todos')
        .each(todo => {
          const newTodo = Cypress._.merge(todo, {isComplete: false})
          cy.request('POST', '/api/todos', newTodo)
        })
        cy.visit('/')
    })

    it('loads existing data from DB', ()=>{
      cy.get('.todo-list li')
        .should('have.length', 4)
    })

    it('deletes todos', ()=>{
      cy.server()
      cy.route('DELETE', '/api/todos/*')
        .as('delete')

      cy.get('.todo-list li')
        .each($el=>{
          cy.wrap($el)
            .find('.destroy')
            .invoke('show')
            .click()

          cy.wait('@delete')
        })
        .should('not.exist')
    })

    it('toggles todos', ()=>{
      const clickAndWait = ($el) =>{
        cy.wrap($el)
          .as('item')
          .find('.toggle')
          .click()

        cy.wait('@update')
      }
        cy.server()
        cy.route('PUT', '/api/todos/*')
          .as('update')
        
        cy.get('.todo-list li')
          .each($el=>{
            clickAndWait($el)
            cy.get('@item')
              .should('have.class', 'complete')
        })
          .each($el=>{
            clickAndWait($el)
            cy.get('@item')
              .should('not.have.class', 'complete')
        })
    })
  })
})