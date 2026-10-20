describe('Login page', () => {
  it('should redirect to the login page', () => {
    cy.visit('/');

    cy.url().should('include', '/login');
  });

  it('should display the login form', () => {
    cy.visit('/login');

    cy.get('form').should('be.visible');
  });

  it('should keep the Login button disabled when the form is empty', () => {
    cy.visit('/login');

    cy.get('button[type="submit"]')
      .should('be.disabled');

    cy.get('input[formControlName="login"]')
      .should('have.value', '');

    cy.get('input[formControlName="password"]')
      .should('have.value', '');
  });

  it('should toggle password visibility', () => {
    cy.visit('/login');

    cy.get('input[formControlName="password"]')
      .should('have.attr', 'type', 'password');

    cy.get('button[mat-icon-button]')
      .click();

    cy.get('input[formControlName="password"]')
      .should('have.attr', 'type', 'text');

    cy.get('button[mat-icon-button]')
      .click();

    cy.get('input[formControlName="password"]')
      .should('have.attr', 'type', 'password');
  });

  it('should display a loading indicator while logging in', () => {
    cy.intercept('POST', '/api/login', {
        statusCode: 200,
        body: 'fake-token',
        headers: {
        'content-type': 'text/plain'
        },
        delay: 5000
    }).as('loginRequest');

    cy.visit('/login');

    cy.get('input[formControlName="login"]').type('testuser');
    cy.get('input[formControlName="password"]').type('password123');
    cy.contains('button', 'Login').click();

    cy.get('mat-spinner', { timeout: 3000 }).should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should not send a login request when the form is invalid', () => {
    cy.intercept('POST', '/api/login').as('loginRequest');

    cy.visit('/login');

    // Leave the form empty and invoke native form submission.
    cy.get('form').then(($form) => {
        $form[0].dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
        );
    });

    cy.get('input[formControlName="login"]').should('have.value', '');
    cy.get('input[formControlName="password"]').should('have.value', '');

    cy.get('@loginRequest.all').should('have.length', 0);
  });
  
  it('should log in and navigate to the students page', () => {
    cy.login();

    cy.url().should('include', '/students');
  });

  //some error case
  it('should display the error message when login fails with a JSON response', () => {
    cy.intercept('POST', '/api/login', {
        statusCode: 401,
        body: {
        message: 'Invalid username or password'
        }
    }).as('loginRequest');

    cy.visit('/login');

    cy.get('input[formControlName="login"]').type('testuser');
    cy.get('input[formControlName="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.contains('Invalid username or password').should('be.visible');
    cy.get('mat-spinner').should('not.exist');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should display a connection error when the server is unreachable', () => {
    cy.intercept('POST', '/api/login', {
        statusCode: 0,
        forceNetworkError: true
    }).as('loginRequest');

    cy.visit('/login');

    cy.get('input[formControlName="login"]').type('testuser');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.get('body', { timeout: 10000 })
        .should('contain.text', 'Request failed (0).');

    cy.get('mat-spinner').should('not.exist');
  });
});