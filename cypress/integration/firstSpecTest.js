/// <reference types="cypress" />

describe (' Test with backend', () => {

    beforeEach(' login to the app', () => {

        //cy.server()
        //cy.route('GET', '**/tags', 'fixture:text.json')
        cy.intercept({method: 'Get', path:'tags'}, {fixture:'text.json'})

        //cy.creatingNewAccount()
        cy.loginToApplication()
    })

    it("verify correct request and response", () => {
        
        //cy.route('POST', '**/articles').as('postArticles')
        cy.intercept('POST', '**/api.realworld.io/api/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').type('Title Test Using Route abc')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body of the article')
            expect(xhr.response.body.article.description).to.equal('This is a description')
            
        })

    })

    it("intercepting and modifying the request and response", () => {
        
        // cy.intercept('POST', '**/api.realworld.io/api/articles', (req)=> {
        //     req.body.article.description = "This is a description 2"
        // }).as('postArticles')

        cy.intercept('POST', '**/api.realworld.io/api/articles', (req)=> {
            req.reply(res => {
                expect(res.body.article.description).to.equal('This is a description')
                res.body.article.description = "This is a description 2"
            })
        }).as('postArticles')

        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').type('Title Test Using Route abcd')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body of the article')
            expect(xhr.response.body.article.description).to.equal('This is a description 2')
            
        })

    })


    it('should give tags with routing object', () => {
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'testing')
    })

    it('verfify global feed likes count', () => {

        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercept('GET', '**/articles*', {fixture:'articles.json'})

        cy.contains('Global Feed').click()

        cy.get('app-article-list button').then(listOfButtons => {

            expect(listOfButtons[0]).to.contain('1')
            expect(listOfButtons[1]).to.contain('5')
        })
        
        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            cy.intercept('POST', '**/articles/'+articleLink+'/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '6')

    })

    it('delete a new article in global feed', () => {

        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Request from API",
                "description": "API testing is easy",
                "body": "Angular is cool"
            }
        }

        cy.get('@token').then(token => {
                
                cy.request({
                    url :  Cypress.env('apiUrl') + "api/articles/",
                    headers: {"Authorization" : "Token " + token},
                    method : "POST",
                    body : bodyRequest
    
                }).then ( response => {
                    expect(response.status).to.equal(200)
                })

                cy.contains('Global Feed').click()
                cy.get('.article-preview').eq(0).click()
                cy.get('.article-actions').contains('Delete Article').click()

                // Added this in here as Cypress is too fast so it makes the API reuqest before the article has a chance to be deleted
                cy.wait(500)

                cy.request({
                    url :  Cypress.env('apiUrl') + "api/articles?limit=10&offset=0",
                    headers: {"Authorization" : "Token " + token},
                    method : "GET",
                }).its('body').then(body => {
                    expect(body.articles[0].title).not.to.equal('Request from API')
                })
            })
    })
})