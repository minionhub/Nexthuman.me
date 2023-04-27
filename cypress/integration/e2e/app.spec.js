describe('app', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });

  it('will load', () => {
    cy.get('body').should('be.visible');
  });
  it('not authenticated yet', () => {
    cy.get('[data-testid=get-started]').should('be.visible');
    cy.get('[data-testid=signin]').should('be.visible');
  });
  it('will redirect to login', () => {
    cy.visit('/home');
    cy.url().should('contain', '/sign_in');
  });
  context('sign up', () => {
    var randomEmail =
      Math.random().toString(36).substring(2, 5) +
      Math.random().toString(36).substring(2, 5) +
      '@gmail.com';
    it('Form fields are displayed', () => {
      cy.visit('/');
      cy.get('[data-testid=get-started]').click();
      cy.get('[data-testid=signupForm]').should('be.visible');
      cy.get('[data-testid=signupForm]').checkSignUpFormFields();
    });

    it('Email is not valid', () => {
      cy.wait(5000);
      cy.get('[data-testid=signupForm]')
        .setUsername('testuser')
        .setEmail('testinvalidemail.com')
        .setPassword('12345')
        .setPassword2('12345');
      cy.get('[data-testid=checkbox-agreeTerms]').click();
      cy.get('[data-testid=btnSignup]').click();
    });
    it('Password is not match', () => {
      cy.wait(5000);
      cy.get('[data-testid=signupForm]')
        .setUsername('testuser')
        .setEmail('test@gmail.com')
        .setPassword('123456')
        .setPassword2('123457');
      cy.get('[data-testid=btnSignup]').click();
    });
    it('Password is too short', () => {
      cy.wait(5000);
      cy.get('[data-testid=signupForm]')
        .setUsername('testuser')
        .setEmail('test@gmail.com')
        .setPassword('1234')
        .setPassword2('1234');
      cy.get('[data-testid=btnSignup]').click();
    });
    it('All fields are valid', () => {
      cy.wait(5000);
      cy.get('[data-testid=signupForm]')
        .setUsername('testuser')
        .setEmail(randomEmail)
        .setPassword('123456')
        .setPassword2('123456');
      cy.get('[data-testid=btnSignup]').click();
    });
    it('Signup was success', () => {
      cy.get('[data-testid=btnSignup]').click();
      cy.wait(10000);
      cy.get('[data-testid=verifyTitle]').should('be.visible').should('contain', 'Verify account');
    });
    it('Duplicated signup', () => {
      cy.visit('/Signup');
      cy.get('[data-testid=signupForm]')
        .setUsername('testuser')
        .setEmail(randomEmail)
        .setPassword('123456')
        .setPassword2('123456');
      cy.get('[data-testid=checkbox-agreeTerms]').click();
      cy.get('[data-testid=btnSignup]').click();
      cy.wait(3000);

      cy.get('[data-testid=alert]')
        .should('be.visible')
        .should('contain', 'The email address is already in use by another account');
    });
  });
  context('sign in', () => {
    it('Form fields are displayed', () => {
      cy.visit('/');
      cy.get('[data-testid=signin]').click();
      cy.get('[data-testid=loginForm]').should('be.visible');
      cy.get('[data-testid=loginForm]').checkLoginFormFields();
    });
    it('Email is not valid', () => {
      cy.get('[data-testid=loginForm]')
        .setEmail('testinvalidemail.com')
        .setPassword('123456')
        .notValidLoginFormState();
    });
    it('Email is valid', () => {
      cy.get('[data-testid=loginForm]')
        .setEmail('grgicdaniel07@gmail.com')
        .setPassword('123456')
        .validLoginFormState();
    });
    it('Login was not successful', () => {
      cy.get('[data-testid=btnLogin]').click();
      cy.wait(10000);
      cy.get('[data-testid=alert]').should('be.visible');
    });
    it('Login successful', () => {
      cy.get('[data-testid=loginForm]').setPassword('!Aa12345');
      cy.get('[data-testid=btnLogin]').click();
      cy.wait(10000);
      cy.get('[data-testid=nav-btn]').should('be.visible');
      cy.get('[data-testid=selected-avatar]').should('be.visible');
      cy.get('[data-testid=selected-name]').should('be.visible');
      // cy.get('[data-testid=selected-tagline]').should('be.visible');
    });
  });
  context('forgot password', () => {
    it('Form fields are displayed', () => {
      cy.visit('/sign_in');
      cy.get('[data-testid=loginForm]').setEmail('test@gmail.com');
      cy.get('[data-testid=forgot-link').click();
      cy.get('[data-testid=forgotForm]').should('be.visible');
      cy.get('[data-testid=forgotForm]').checkForgotFormFields();
    });
    it('Email is valid', () => {
      cy.get('[data-testid=forgotForm]').checkEmail('test@gmail.com');
    });
    // it("Sent link to rest password", () => {
    // 	cy.get('[data-testid=btnForgot]').click();
    // 	cy.wait(5000);
    // 	cy.get('[data-testid=alert]')
    // 		.should("be.visible")
    // 		.should("contain", "We sent the reset email successfully!");
    // 	//cy.url().should("contain", "/login" );
    // });
  });
});
