describe('account', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });
  it('sign in', () => {
    cy.visit('/sign_in');
    cy.get('[data-testid=loginForm]').setEmail('grgicdaniel07@gmail.com').setPassword('!Aa12345');
    cy.get('[data-testid=btnLogin]').click();
    cy.wait(10000);
    cy.visit('/');
  });
  it('manage account', () => {
    cy.get('[data-testid="link-account"]').click();
    cy.get('[data-testid=progress]', { timeout: 10000 }).should('not.be.visible');
    cy.get('[data-testid=textField-keyword]').type('DanielG');
    cy.get('[data-testid=account-type]').first().as('accountType').should('contain', 'admin');
    cy.get('[data-testid=switch-usertype]').first().as('testSwitch').click();
    cy.wait(1000);
    cy.get('@accountType').should('contain', 'normal');
    cy.get('@testSwitch').should('not.be.checked');
    cy.get('@testSwitch').click();
  });
});
