describe('input form', ()=>{
    beforeEach(()=>{
        cy.visit('/')
    })

    it('focuses input on load', ()=>{
        cy.focused() // had to add autoFocus to TodoForm
          .should('have.class', 'new-todo')
    })

    it('accepts input', ()=>{ // .only = this test runs by itself - good when writing new test
        const typedText ='Buy Milk'

        cy.get('.new-todo') // better to use get instead of focus - keep tests isolated from unrelated features
          .type(typedText)
          .should('have.value', typedText)
    })

    context('Form submission', ()=>{ // context = grouping
        beforeEach(()=> {
            cy.server() // stubs out commands so it doesn't rely on backend // control responses
        })

        it('Adds a new to-do on submit', ()=>{
            const itemText = 'Buy Eggs'
            cy.route('POST', '/api/todos', {
                name: itemText,
                id: 1,
                isComplete: false
            })

            cy.get('.new-todo')
              .type(itemText) // need POST & submit handler in app & lib/service.js
              .type('{enter}') // action in {}
              .should('have.value', '')

            cy.get('.todo-list li')
              .should('have.length', 1)
              .and('contain', itemText) // and = should, just reads better
        })

        it('Shows an error message on a failed submission', ()=>{
            cy.route({
                url: '/api/todos',
                method: 'POST',
                status: 500,
                response: {}
            })
            cy.get('.new-todo')
              .type('test{enter}')
            
            cy.get('.todo-list li')
              .should('not.exist')
    
            cy.get('.error')
              .should('be.visible')
        })

    })
})