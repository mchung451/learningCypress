
describe ('first suite', () => {

    it('visiting', () => {
        cy.visit('/')
        cy.get('.ewr-chc').find('contain', 'B')
    })  
})