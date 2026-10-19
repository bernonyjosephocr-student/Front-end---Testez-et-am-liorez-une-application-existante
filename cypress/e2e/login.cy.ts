describe('login page', () => {
    // Tests the routing to login
    it('should redirect to the login path', () => {
        cy.visit('/');
        cy.url().should('include','/login')
    } )

    // Tests showing form
    it('should display the login form', () => {
        cy.visit('/login');
        cy.get('form').should('be.visible');
    });
});

describe('User login', () => {

  it('should log in with the existing test user', () => {
    cy.login();

    cy.contains('Student Management').should('be.visible');
  });

});