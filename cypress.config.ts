import { defineConfig } from 'cypress'

export default defineConfig({
  
  e2e: {
    'baseUrl': 'http://localhost:4200',
    // Cypress va chercher et exécuter les specs dans l'ordre de ce tableau
    specPattern: [
      "cypress/e2e/registration.cy.ts",
      "cypress/e2e/login.cy.ts",
      "cypress/e2e/student-management.cy.ts",
    ],
    setupNodeEvents(on, config) {
      // Intégration du plugin de couverture de code
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },

})