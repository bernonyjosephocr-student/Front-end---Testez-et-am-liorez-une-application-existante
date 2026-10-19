describe('Login page', () => {
  it('should redirect to the login page', () => {
    cy.visit('/');

    cy.url().should('include', '/login');
  });

  it('should display the login form', () => {
    cy.visit('/login');

    cy.get('form').should('be.visible');
  });

  it('should log in and navigate to the students page', () => {
    cy.login();
    cy.url().should('include', '/students');
  });

});