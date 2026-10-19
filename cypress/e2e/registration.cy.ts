describe('User registration and login', () => {
  const testUser = {
    firstName: 'Cypress',
    lastName: 'Test',
    login: `cypress.test`,
    password: 'CypressTest123!'
  };

  it('should register a user and log in successfully', () => {
    // Handle the success alert displayed after registration.
    cy.on('window:alert', (message) => {
      expect(message).to.contain('SUCCESS');
    });

    // Step 1: Open the registration page.
    cy.visit('/register');

    // Step 2: Fill in the registration form.
    cy.get('input[formControlName="firstName"]')
      .type(testUser.firstName);

    cy.get('input[formControlName="lastName"]')
      .type(testUser.lastName);

    cy.get('input[formControlName="login"]')
      .type(testUser.login);

    cy.get('input[formControlName="password"]')
      .type(testUser.password);

    // Step 3: Submit the registration form.
    cy.contains('button', 'Register').click();

    // Step 4: Verify the redirect to the login page.
    cy.url().should('include', '/login');
  });
});