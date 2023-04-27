describe('book', () => {
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

  it('load all books', () => {
    cy.visit('/books');
  });
  it('add book', () => {
    cy.get('[data-testid=btn-acceptCookies]').click();
    cy.get('[data-testid=btn-createNewBook]').click();
    cy.url().should('contain', '/books/new');
  });
  it('all element should be visible', () => {
    cy.get('[data-testid=createBookForm]').should('be.visible');
    cy.get('[data-testid=textfield-BookName]').should('be.visible');
    cy.get('[data-testid=textfield-Subtitle]').should('be.visible');
    cy.get('[data-testid=textfield-desc]').should('be.visible');
    cy.get('[data-testid=filefield-CoverImage]').should('be.visible');
  });
  it('create book', () => {
    cy.wait(5000);
    cy.get('[data-testid=textfield-BookName]').type('Test Book');
    cy.get('[data-testid=textfield-Subtitle]').type('Volutpat leo hendrerit potenti');
    cy.get('[data-testid=filefield-CoverImage]').within(() => {
      cy.get('.btn-browse').click();
    });
    cy.wait(20000);
    cy.get('.tam-assetmanager-container').should('be.visible');
    cy.get('.tam-assetmanager-container .tam-asset.tam-asset--file').eq(0).click();
    // cy.get('[data-testid=checkbox-agreeTerms]').click();
    cy.get('[data-testid=btn-createBook]').click();
    cy.get('[data-testid=modal-confirm]').should('be.visible');
    cy.get('[data-testid=btn-confirm]').click();
  });

  it('view book', () => {
    cy.visit('/books');
    cy.wait(20000);
    cy.get('[data-testid=btn-acceptCookies]').click();
    cy.get('[data-testid=btn-viewBook]').first().click();
    cy.get('[data-testid=book-name]').should('be.visible');
  });

  it('add chapter', () => {
    cy.get('[data-testid=open-book]').click();
    cy.get('[data-testid=btn-createNewChapter]').click();
    cy.get('[data-testid=textfield-ChapterName]').type('Background');
    cy.get('[data-testid=btn-confirm]').click();
    cy.get('[data-testid=btn-createNewChapter]').click();
    cy.get('[data-testid=textfield-ChapterName]').type('How fun in life');
    cy.get('[data-testid=btn-confirm]').click();
    cy.get('[data-testid=btn-createNewChapter]').click();
    cy.get('[data-testid=textfield-ChapterName]').type('Traveling');
    cy.get('[data-testid=btn-confirm]').click();
    cy.get('[data-testid=btn-createNewChapter]').click();
    cy.get('[data-testid=textfield-ChapterName]').type('Team buliding');
    cy.get('[data-testid=btn-confirm]').click();
  });

  // it('delete book', () => {
  //   cy.get('[data-testid=open-book]').click();
  //   cy.get('[data-testid=btn-delete]').click();
  //   cy.get('[data-testid=modal-confirm]').should('be.visible');
  //   cy.get('[data-testid=btn-confirm]').click();
  // });
});
