Cypress.Commands.add(
    "checkLoginFormFields",
    { prevSubject: true},
    (subject) => {
        return cy.wrap(subject)
                .within(() => {
                    cy.get('[data-testid=email]').should("be.visible");
                    cy.get('[data-testid=password]').should("be.visible");
                    cy.get('[data-testid=btnLogin]').should("be.visible").should("be.disabled");
                })
    }
)
Cypress.Commands.add(
    "notValidLoginFormState",
    { prevSubject: true},
    (subject) => {
        return cy.wrap(subject)
                .within(() => {
                    
                    cy.get('[data-testid=btnLogin]').should("be.visible").should("be.disabled");
                })
    }
)
Cypress.Commands.add(
    "validLoginFormState",
    { prevSubject: true},
    (subject) => {
        return cy.wrap(subject)
                .within(() => {                    
                    cy.get('[data-testid=btnLogin]').should("be.visible").should("not.be.disabled");
                })
    }
)

