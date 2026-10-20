describe('Authentication Guard', () => {

  it('should redirect to login when no token exists', () => {
    cy.visit('/students');

    cy.url().should('include', '/login');
  });

  it('should allow access to students when the token is valid', () => {
    const token = createToken(
      Math.floor(Date.now() / 1000) + 3600
    );

    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', token);
      }
    });

    cy.url().should('include', '/students');
  });

  it('should remove the token and redirect to login when the JWT format is invalid', () => {
    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', 'invalid-token');
      }
    });

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should remove the token and redirect to login when the payload is invalid JSON', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const invalidPayload = btoa('{invalid json');

    const token = `${header}.${invalidPayload}.signature`;

    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', token);
      }
    });

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should remove the token and redirect to login when the expiration is missing', () => {
    const token = createTokenWithoutExpiration();

    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', token);
      }
    });

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should remove the token and redirect to login when the expiration is not a number', () => {
    const token = createToken('2099' as unknown as number);

    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', token);
      }
    });

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should remove the token and redirect to login when the token has expired', () => {
    const token = createToken(
      Math.floor(Date.now() / 1000) - 3600
    );

    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', token);
      }
    });

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should remove the token and redirect to login when the payload cannot be decoded', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const token = `${header}.%%%.signature`;

    cy.visit('/students', {
      onBeforeLoad(window) {
        window.localStorage.setItem('authToken', token);
      }
    });

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });
  });
});


function createToken(exp: number): string {
  const header = btoa(JSON.stringify({
    alg: 'HS256',
    typ: 'JWT'
  }));

  const payload = btoa(JSON.stringify({ exp }));

  return `${header}.${payload}.signature`;
}


function createTokenWithoutExpiration(): string {
  const header = btoa(JSON.stringify({
    alg: 'HS256',
    typ: 'JWT'
  }));

  const payload = btoa(JSON.stringify({
    sub: 'test-user'
  }));

  return `${header}.${payload}.signature`;
}