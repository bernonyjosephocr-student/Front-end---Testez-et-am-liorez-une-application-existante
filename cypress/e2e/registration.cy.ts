describe('User registration', () => {
  it('should register a user and redirect to login', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: {}
    }).as('registerRequest');

    cy.on('window:alert', (message) => {
      expect(message).to.contain('SUCCESS');
    });

    cy.visit('/register');

    cy.get('input[formControlName="firstName"]').type('Cypress');
    cy.get('input[formControlName="lastName"]').type('Test');
    cy.get('input[formControlName="login"]').type('cypress.test');
    cy.get('input[formControlName="password"]').type('CypressTest123!');

    cy.contains('button', 'Register').click();

    cy.wait('@registerRequest')
      .its('response.statusCode')
      .should('equal', 200);

    cy.url().should('include', '/login');
  });
});