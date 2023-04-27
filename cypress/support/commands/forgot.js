Cypress.Commands.add(
    "checkForgotFormFields",
    { prevSubject: true},
    (subject) => {
        return cy.wrap(subject)
                .within(() => {
                    cy.get('[data-testid=email]').should("be.visible");
                    cy.get('[data-testid=btnForgot]').should("be.visible");
                })
    }
)
Cypress.Commands.add(
    "checkEmail",
    { prevSubject: true},
    (subject, value) => {
        return cy.wrap(subject)
                .within(() => {
                    
                    cy.get('[data-testid=email]').should('have.value', value);
                })
    }
)
Cypress.Commands.add(
    "notValidForgotFormState",
    { prevSubject: true},
    (subject) => {
        return cy.wrap(subject)
                .within(() => {
                    
                    cy.get('[data-testid=btnForgot]').should("be.visible").should("be.disabled");
                })
    }
)
Cypress.Commands.add(
    "validForgotFormState",
    { prevSubject: true},
    (subject) => {
        return cy.wrap(subject)
                .within(() => {                    
                    cy.get('[data-testid=btnForgot]').should("be.visible").should("not.be.disabled");
                })
    }
)