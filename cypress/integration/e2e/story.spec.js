describe('story', () => {
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
  context('manage story', () => {
    it('character menu will be opened', () => {
      cy.wait(5000);
      cy.get('[data-testid=nav-btn]').click();
      cy.get('[data-testid=character-menu').should('be.visible');
    });
    it('switch character and create story', () => {
      cy.get('[data-testid=character-menu] ul div .MuiLink-root').eq(0).click();
      cy.get('[data-testid=btn-acceptCookies]').click();
      cy.get('[data-testid=btn-createNewStory]').click();
    });
    it('create story', () => {
      cy.wait(20000);
      cy.get('[data-testid=createStoryForm]').should('be.visible');
      cy.get('[data-testid=textfield-title]').should('be.visible');
      cy.get('[data-testid=textfield-subtitle]').should('be.visible');
      cy.get('[data-testid=textfield-desc]').should('be.visible');
      cy.get('[data-testid=filefield-coverImage]').should('be.visible');
      cy.get('[data-testid=filefield-audio]').should('be.visible');
      cy.get('[data-testid=locationfield-location]').should('be.visible');
      cy.get('[data-testid=autocompletefield-characters]').should('be.visible');
      cy.get('[data-testid=autocompletefield-experiences]').should('be.visible');

      cy.get('[data-testid=textfield-title]').type('Test Story');
      cy.get('[data-testid=textfield-subtitle]').type('Era of the moonlit');

      cy.setTinyMceContent(
        'mention-tinymce-editor',
        'Iaculis sociis tristique nunc, molestie ridiculus feugiat non. Et cursus tellus non, egestas aliquet fringilla sed molestie. Venenatis massa enim mattis pellentesque elit id enim viverra.'
      );

      cy.get('[data-testid=filefield-coverImage] button').click();
      cy.wait(15000);
      cy.get('.tam-assetmanager-container').should('be.visible');
      cy.get('.tam-assetmanager-container .tam-asset.tam-asset--file').eq(0).click();
      cy.get('[data-testid=filefield-audio] button').click();
      cy.wait(15000);
      cy.get('.tam-assetmanager-container').should('be.visible');
      cy.get('.tam-assetmanager-container .tam-asset.tam-asset--file .tam-asset__icon-container')
        .eq(0)
        .click();
      cy.get('[data-testid=locationfield-location]').type('Texas{downarrow}{enter}');
      cy.wait(5000);
      cy.get('[data-testid=locationfield-location]').type('{downarrow}{enter}');
      cy.get('[data-testid=autocompletefield-experiences] input')
        .focus()
        .type('{uparrow}{uparrow}{uparrow}')
        .type('{enter}');
      cy.get('[data-testid=autocompletefield-characters] input')
        .focus()
        .type('{uparrow}{uparrow}')
        .type('{enter}');

      cy.get('[data-testid=btn-createStory]').click();
      cy.wait(10000);
    });

    it('edit story', () => {
      cy.wait(10000);
      cy.get('[data-testid=btn-editStory]').click();
      cy.get('[data-testid=updateStoryForm]').should('be.visible');
      cy.get('[data-testid=textfield-title]').should('be.visible');
      cy.get('[data-testid=textfield-subtitle]').should('be.visible');
      cy.get('[data-testid=textfield-desc]').should('be.visible');
      cy.get('[data-testid=filefield-coverImage]').should('be.visible');
      cy.get('[data-testid=filefield-audio]').should('be.visible');
      cy.get('[data-testid=locationfield-location]').should('be.visible');
      cy.get('[data-testid=autocompletefield-characters]').should('be.visible');
      cy.get('[data-testid=autocompletefield-experiences]').should('be.visible');
      cy.wait(20000);
      cy.get('[data-testid=textfield-title]').type('{selectall}', 'Test Story2');
      cy.get('[data-testid=btn-updateStory]').click();
      cy.wait(10000);
    });

    it('add to book', () => {
      cy.get('[data-testid=btn-addToBook]').click();
      cy.wait(10000);
      cy.get('[data-testid=book-select]').click();
      cy.get('[data-testid=select-item]').eq(0).click();
      cy.wait(5000);
      cy.get('[data-testid=chapter-select]').click();
      cy.get('[data-testid=select-item]').eq(0).click();
      cy.get('[data-testid=btn-confirm]').click();
      cy.wait(10000);
    });

    it('delete story', () => {
      cy.get('[data-testid=btn-editStory]').click();
      cy.wait(20000);
      cy.get('[data-testid=btn-delete').click();
      cy.get('[data-testid=modal-confirm]').should('be.visible');
      cy.get('[data-testid=btn-confirm').click();
    });
  });
});
