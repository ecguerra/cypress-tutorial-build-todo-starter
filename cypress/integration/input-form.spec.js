describe('input form', ()=>{
    beforeEach(()=>{
        cy.visit('/')
    })

    it('focuses input on load', ()=>{
        cy.focused() // had to add autoFocus to TodoForm
          .should('have.class', 'new-todo')
    })

    it('accepts input', ()=>{ // .only = this test runs by itself
        const typedText ='Buy Milk'

        cy.get('.new-todo') // better to use get instead of focus - keep tests isolated from unrelated features
          .type(typedText)
          .should('have.value', typedText)
    })
})