describe('Coverage instrumentation check', () => {
  it('should expose coverage counters in the application', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const coverage = (win as Window & {
        __coverage__?: Record<string, unknown>;
      }).__coverage__;

      cy.log(
        coverage
          ? `Coverage detected: ${Object.keys(coverage).length} files`
          : 'Coverage NOT detected'
      );

      expect(coverage, 'window.__coverage__').to.exist;
    });
  });
});