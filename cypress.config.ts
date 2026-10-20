import { defineConfig } from 'cypress'
const registerCodeCoverageTasks = require('@cypress/code-coverage/task');
export default defineConfig({
  
  e2e: {
    'baseUrl': 'http://localhost:4200',
    // Cypress va chercher et exécuter les specs dans l'ordre de ce tableau
    specPattern: [
      "cypress/e2e/registration.cy.ts",
      "cypress/e2e/login.cy.ts",
      "cypress/e2e/student-management.cy.ts",
      "cypress/e2e/coverage-check.cy.ts",
      "cypress/e2e/auth-guard.cy.ts",
    ],
    setupNodeEvents(on, config) {
      // Intégration du plugin de couverture de code
      registerCodeCoverageTasks(on, config);
      return config;
    },
  },

})