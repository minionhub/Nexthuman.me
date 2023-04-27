describe('character', () => {
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
    cy.wait(10000);
    cy.visit('/');
  });

  it('character menu will be opened', () => {
    cy.wait(5000);
    cy.get('[data-testid=nav-btn]').click();
    cy.get('[data-testid=character-menu').should('be.visible');
  });
  it('add character', () => {
    cy.get('[data-testid=add-character]').click();
    cy.wait(3000);
    cy.url().should('contain', '/character/new');
  });
  it('all element should be visible', () => {
    cy.get('[data-testid=createCharacterForm').should('be.visible');
    cy.get('[data-testid=textField-character-name').should('be.visible');
    cy.get('[data-testid=textField-character-tagline').should('be.visible');
    cy.get('[data-testid=textArea-character-bio').should('be.visible');
    cy.get('[data-testid=textArea-character-intentions').should('be.visible');
    cy.get('[data-testid=autocomplete-character-experiences').should('be.visible');
    cy.get('[data-testid=switch-anonymous').should('be.visible');
    cy.get('[data-testid=save-character').should('be.visible');
    cy.get('[data-testid=upload-image').should('be.visible');
  });
  it('create character', () => {
    cy.get('[data-testid=upload-image').click();
    cy.wait(15000);
    cy.get('.tam-assetmanager-container').should('be.visible');
    cy.get('.tam-assetmanager-container .tam-asset.tam-asset--file').eq(0).click();
    cy.get('[data-testid=textField-character-name').type('Test Parrot');
    cy.get('[data-testid=textField-character-tagline').type('Test tag');
    cy.get('[data-testid=textArea-character-bio').type('Test bio');
    cy.get('[data-testid=textArea-character-intentions').type('Test intentions');
    cy.get('[data-testid=autocomplete-character-experiences] input')
      .focus()
      .type('{uparrow}{uparrow}{uparrow}')
      .type('{enter}');

    cy.get('[data-testid=autocomplete-character-experiences] input')
      .focus()
      .type('{uparrow}{uparrow}{uparrow}')
      .type('{enter}');
    cy.get('[data-testid=switch-anonymous').click();
    cy.get('[data-testid=save-character').click();
    cy.wait(5000);
  });
  it('check if its in view mode', () => {
    cy.get('[data-testid=selected-name]').should('contain', 'Test Parrot');
    cy.get('[data-testid=selected-tagline]').should('contain', 'Test tag');
    cy.get('[data-testid=edit-character').should('be.visible');
    cy.get('[data-testid=delete-character').should('be.visible');
    cy.get('[data-testid=label-character-name').should('be.visible');
    cy.get('[data-testid=label-character-tagline').should('be.visible');
    cy.get('[data-testid=label-character-bio').should('be.visible');
    cy.get('[data-testid=label-character-intentions').should('be.visible');
    cy.get('[data-testid=experiences-score-container').should('be.visible');
    cy.get('[data-testid=attendings-container').should('be.visible');
    cy.get('[data-testid=profileby-container').should('be.visible');
  });
  it('switching character', () => {
    cy.get('[data-testid=story-list').should('be.visible');
    cy.get('[data-testid=nav-btn]').click();
    cy.get('[data-testid=character-menu] ul div [data-testid=change-character-button]')
      .eq(0)
      .click();
    cy.wait(1000);
    // cy.get('[data-testid=selected-name]').should('contain', 'The Parrot');
    // cy.get('[data-testid=selected-tagline]').should('contain', 'Queen of Darkness');
    cy.get('[data-testid=nav-btn]').click();
    cy.get('[data-testid=character-menu] ul div [data-testid=change-character-button]')
      .eq(0)
      .click();
  });

  it('edit character', () => {
    cy.get('[data-testid=story-list').should('be.visible');
    cy.get('[data-testid=edit-character').click();
    cy.get('[data-testid=textField-character-name').type('{selectall}Test Parrot1');
    cy.get('[data-testid=save-character').click();
    // cy.get('[data-testid=selected-name]').should('contain', 'Test Parrot1');
    cy.wait(5000);
  });

  it('delete character', () => {
    cy.get('[data-testid=delete-character').click();
    cy.get('[data-testid=confirm-dialog').should('be.visible');
    cy.get('[data-testid=btn-agree').should('be.visible');
    cy.get('[data-testid=btn-agree').click();
    // cy.get('[data-testid=selected-name]').should('not.contain', 'Test Parrot1');
    cy.wait(5000);
  });
});
