/// <reference types="cypress" />

describe("our first suite", () => {

    it("first test", () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //by Tag Name
        cy.get('input')

        //by ID
        cy.get('#inputEmail1')

        //by Class Name
        cy.get('.input-full-width')

        //by Attribute Name
        cy.get('[placeholder]')

        //by Attribute Name and value
        cy.get('[placeholder="Email"]')

        //by Class value    
        cy.get('[class="input-full-width size-medium shape-rectangle"]')
    
        //by Tag name and Attribute with value
        cy.get('input[placeholder="Email"]')

        //by two different Attributes
        cy.get('[placeholder="Email"][type="email"]')

        //by tag name, attribute with value, ID and Class name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //The most recommended way by Cypress
        cy.get('[data-cy="imputEmail1"]')
    })

    it("second test", () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')

        cy.contains('Sign in')

        cy.contains('[status="warning"]','Sign in')

        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain','Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
        
        cy.contains('nb-card','Horizontal form').find('[type="email"]')


    })

    it("then and wrap methods", () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // // For the 'Using the Grid' form => Email
        // cy.contains('nb-card','Using the Grid')
        //     .find('[for="inputEmail1"]')
        //     .should('contain','Email')

        // // For the 'Using the Grid' form => Password
        // cy.contains('nb-card','Using the Grid')
        //     .find('[for="inputPassword2"]')
        //     .should('contain', 'Password')

        // // For the 'Basic Form' => Email address
        // cy.contains('nb-card', 'Basic form')
        //     .find('[for="exampleInputEmail1"]')
        //     .should('contain', 'Email address')

        // // For the 'Basic Form' => Passowrd
        // cy.contains('nb-card', 'Basic form')
        //     .find('[for="exampleInputPassword1"]')
        //     .should('contain','Password')

        // Cypress - Uses jquery method/ chai method
        // To return back to cypress, use the .wrap function
        cy.contains('nb-card', 'Using the Grid').then(firstForm =>{
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()
            expect(emailLabelFirst).to.equal('Email')
            expect(passwordLabelFirst).to.equal('Password')

            cy.contains('nb-card', 'Basic form').then(secondForm =>{
                const emailLabelSecond = secondForm.find('[for="exampleInputEmail1"]').text()
                const passwordLabelSecond = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(passwordLabelFirst).to.equal(passwordLabelSecond)

                cy.wrap(secondForm)
                    .find('[for="exampleInputEmail1"]')
                    .should('contain', 'Email address')
            })
        })
    })

    it('invoke command', () =>{

            cy.visit('/')
            cy.contains('Forms').click()
            cy.contains('Form Layouts').click()

            // Example 1
            cy.get('[for="exampleInputEmail1"]')
                .should('contain', 'Email address')

            // Example 2
            cy.get('[for="exampleInputEmail1"]').then(inputLabel =>{
                expect(inputLabel.text()).to.equal('Email address')

            // Example 3 - Using Invoke
            cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
                expect(text).to.equal('Email address')

            // Example 4 - Find if a checkbox is ticked
            cy.contains('nb-card', 'Basic form')
                .find('nb-checkbox')
                .click()
                .find(".custom-checkbox")
                .invoke('attr', 'class')
                .should('contain', 'checked')

            
            })
        })

    })

    it('assert property', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker')
            .find('input')
            .then(input => {
                cy.wrap(input).click()
                cy.get('nb-calendar-day-picker')
                    .contains('5')
                    .click()
                    cy.wrap(input)
                        .invoke('prop', 'value')
                        .should('contain', 'Nov 5, 2021')
            })

    })

    it('radio button', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid')
            .find('[type="radio"]')
            .then(radioButtons => {

                cy.wrap(radioButtons)
                    .first()
                    .check({force: true})
                    .should('be.checked')


                cy.wrap(radioButtons)
                    .eq(1)
                    .check({force: true})

                cy.wrap(radioButtons)
                .first()
                .should('not.be.checked')

                cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')

            })

    })

    it('check boxes', () => {

        // NB: check method does not uncheck already checked boxes
        // For that, you need to use a click method

        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        // cy.get('[type="checkbox"]')
        //     .check({force: true})

        cy.get('[type="checkbox"]')
            .eq(0)
            .click({force: true})

    })

    it.only('Lists and dropdowns', () => {

        cy.visit('/')

        cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')
        cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        
    })

        
            
})



    