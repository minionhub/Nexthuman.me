Cypress.Commands.add('checkSignUpFormFields', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).within(() => {
    cy.get('[data-testid=username]').should('be.visible');
    cy.get('[data-testid=email]').should('be.visible');
    cy.get('[data-testid=password]').should('be.visible');
    cy.get('[data-testid=password2]').should('be.visible');
  });
});
Cypress.Commands.add('checkSuccessSignUp', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).within(() => {
    cy.get('[data-testid=username]').should('not.be.visible');
    cy.get('[data-testid=email]').should('not.be.visible');
    cy.get('[data-testid=password]').should('not.be.visible');
    cy.get('[data-testid=password2]').should('not.be.visible');
    cy.get('[data-testid=btnBackToHome]').should('be.visible');
  });
});

Cypress.Commands.add('notValidState', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).within(() => {
    cy.get('[data-testid=btnSignup]').should('be.visible').should('be.disabled');
  });
});
Cypress.Commands.add('validState', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).within(() => {
    cy.get('[data-testid=btnSignup]').should('be.visible').should('not.be.disabled');
  });
});

Cypress.Commands.add('setEmail', { prevSubject: true }, (subject, value) => {
  return cy
    .wrap(subject)
    .within(() => {
      cy.get('[data-testid=email]').type(`{selectall}${value}`);
    })
    .wrap(subject);
});

Cypress.Commands.add('setPassword', { prevSubject: true }, (subject, value) => {
  return cy
    .wrap(subject)
    .within(() => {
      cy.get('[data-testid=password]').type(`{selectall}${value}`);
    })
    .wrap(subject);
});
Cypress.Commands.add('setPassword2', { prevSubject: true }, (subject, value) => {
  return cy
    .wrap(subject)
    .within(() => {
      cy.get('[data-testid=password2]').type(`{selectall}${value}`);
    })
    .wrap(subject);
});
Cypress.Commands.add('setUsername', { prevSubject: true }, (subject, value) => {
  return cy
    .wrap(subject)
    .within(() => {
      cy.get('[data-testid=username]').type(`{selectall}${value}`);
    })
    .wrap(subject);
});
// Cypress.Commands.add(
//     "setRole",
//     { prevSubject: true},
//     (subject, value) => {
//         return cy.wrap(subject)
//                 .within(() => {
//                     cy.get('[data-testid=role]').type(`{selectall}${value}`);
//                 })
//                 .wrap(subject);
//     }
// )
