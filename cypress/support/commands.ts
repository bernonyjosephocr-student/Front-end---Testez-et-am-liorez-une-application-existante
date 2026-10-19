// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { testUser } from './test-user';

Cypress.Commands.add('login', () => {
  // Create a JWT-like token with a future expiration time.
  const header = btoa(JSON.stringify({
    alg: 'HS256',
    typ: 'JWT'
  }));

  const payload = btoa(JSON.stringify({
    sub: testUser.login,
    exp: Math.floor(Date.now() / 1000) + 3600
  }));

  // The guard checks the token structure and payload, not the signature.
  const fakeJwtToken = `${header}.${payload}.fake-signature`;

  cy.intercept('POST', '/api/login', {
    statusCode: 200,
    body: fakeJwtToken,
    headers: {
      'content-type': 'text/plain'
    }
  }).as('loginRequest');

  cy.intercept('GET', '/api/students', (req) => {
    // Verify that the interceptor adds the Bearer token.
    expect(req.headers['authorization']).to.equal(
      `Bearer ${fakeJwtToken}`
    );

    req.reply({
      statusCode: 200,
      body: []
    });
  }).as('getStudents');

  cy.visit('/login');

  cy.get('input[formControlName="login"]')
    .clear()
    .type(testUser.login);

  cy.get('input[formControlName="password"]')
    .clear()
    .type(testUser.password);

  cy.contains('button', 'Login').click();

  cy.wait('@loginRequest');

  cy.location('pathname', { timeout: 10000 })
    .should('eq', '/students');

  cy.wait('@getStudents');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}