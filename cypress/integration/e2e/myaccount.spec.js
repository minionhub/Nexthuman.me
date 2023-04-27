import moment from 'moment';
describe('myaccount', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });
  it('login', () => {
    cy.visit('/sign_in');
    cy.get('[data-testid=loginForm]').setEmail('grgicdaniel07@gmail.com').setPassword('!Aa12345');
    cy.get('[data-testid=btnLogin]').click();
    cy.wait(5000);
    cy.visit('/');
  });

  it('navigate to my account page', () => {
    cy.get('[data-testid=myaccount]').click();
    cy.get('[data-testid=label-username').should('be.visible').should('contain', 'DanielG');
    cy.get('[data-testid=label-email')
      .should('be.visible')
      .should('contain', 'grgicdaniel07@gmail.com');
  });

  it('edit basic information', () => {
    cy.get('[data-testid=button-edit-basic]').click();
    cy.get('[data-testid=textfield-username').should('be.visible');
    cy.get('[data-testid=datefield-birthday] button').click();
    cy.get('button.MuiPickersDay-current').should('be.visible');
    cy.get('button.MuiPickersDay-current').click();
    cy.get('[data-testid=textfield-address1').type('{selectall}2715 Ash Dr. San Jose');
    cy.get('[data-testid=textfield-address2').type('{selectall}South Dakota');
    cy.get('[data-testid=textfield-zipcode').type('{selectall}83475');
    cy.get('[data-testid=textfield-city').type('{selectall}Arizona');
    cy.get('[data-testid=autocompletefield-country').type('{selectall}Ukraine');
    cy.get('[data-testid=button-save-basic]').click();
  });
  it('confirm new information', () => {
    cy.get('[data-testid=label-username').should('be.visible').should('contain', 'DanielG');
    cy.get('[data-testid=label-birthday')
      .should('be.visible')
      .should('contain', moment(new Date()).local().format('D MMM YYYY'));
    cy.get('[data-testid=label-address1')
      .should('be.visible')
      .should('contain', '2715 Ash Dr. San Jose');
    cy.get('[data-testid=label-address2-zipcode')
      .should('be.visible')
      .should('contain', 'South Dakota Arizona 83475');
    cy.get('[data-testid=label-phone').should('be.visible').should('contain', '(316) 555-0116');
  });
  it('discard basic information', () => {
    cy.get('[data-testid=button-edit-basic]').click();
    cy.get('[data-testid=button-discard-basic]').click();
    cy.get('[data-testid=label-username').should('be.visible').should('contain', 'DanielG');
    cy.get('[data-testid=label-birthday')
      .should('be.visible')
      .should('contain', moment(new Date()).local().format('D MMM YYYY'));
    cy.get('[data-testid=label-address1')
      .should('be.visible')
      .should('contain', '2715 Ash Dr. San Jose');
    cy.get('[data-testid=label-address2-zipcode')
      .should('be.visible')
      .should('contain', 'South Dakota Arizona 83475');
  });

  it('test sign out', () => {
    cy.get('[data-testid=button-signout').click();
    cy.url().should('contain', '/sign_in');
  });
});
