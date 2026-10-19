describe('Student management - real backend', () => {
  const testUser = {
    firstName: 'Cypress',
    lastName: 'Test',
    login: `cypress-${Date.now()}`,
    password: 'CypressTest123!'
  };

  const student = {
    cardNumber: `CARD-${Date.now()}`,
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '2000-05-15',
    email: `jean.dupont.${Date.now()}@example.com`,
    phoneNumber: '+33612345678',
    homeAddress: '10 Rue de Rennes, 35000 Rennes',
    membershipType: 'Standard',
    studentCardNumber: `STUDENT-${Date.now()}`,
    studentCardExpiryDate: '2027-12-31',
    membershipExpiryDate: '2027-12-31',
    accountStatus: 'ACTIVE'
  };

  it('should create, update, and delete a student', () => {
    cy.login();   

    // Open the student creation form.
    cy.contains('a', 'Add student').click();

    cy.contains('mat-card-title', 'Create Student')
      .should('be.visible');

    // Fill in the student form.
    cy.get('input[formControlName="cardNumber"]')
      .type(student.cardNumber);

    cy.get('input[formControlName="firstName"]')
      .type(student.firstName);

    cy.get('input[formControlName="lastName"]')
      .type(student.lastName);

    cy.get('input[formControlName="dateOfBirth"]')
      .type(student.dateOfBirth);

    cy.get('input[formControlName="email"]')
      .type(student.email);

    cy.get('input[formControlName="phoneNumber"]')
      .type(student.phoneNumber);

    cy.get('textarea[formControlName="homeAddress"]')
      .type(student.homeAddress);

    cy.get('mat-select[formControlName="membershipType"]')
      .click();

    cy.get('mat-option').contains('Premium').click();

    cy.get('input[formControlName="studentCardNumber"]')
      .type(student.studentCardNumber);

    cy.get('input[formControlName="studentCardExpiryDate"]')
      .type(student.studentCardExpiryDate);

    cy.get('input[formControlName="membershipExpiryDate"]')
      .type(student.membershipExpiryDate);

    cy.get('mat-select[formControlName="accountStatus"]')
      .click();

    cy.get('mat-option').contains('Active').click();

    // Save and verify the created student.
    cy.contains('button', 'Create Student').click();

    cy.url().should('match', /\/students\/\d+$/);

    cy.contains('mat-card-title', 'Student Details')
      .should('be.visible');

    cy.contains(student.cardNumber).should('be.visible');
    cy.contains(student.firstName).should('be.visible');
    cy.contains(student.lastName).should('be.visible');
    cy.contains(student.email).should('be.visible');
    cy.contains('Premium').should('be.visible');

    // 4. Edit the student.
    cy.contains('a', 'Edit Student').click();

    cy.contains('mat-card-title', 'Edit Student')
      .should('be.visible');

    const updatedFirstName = 'Jean-Pierre';

    cy.get('input[formControlName="firstName"]')
      .clear()
      .type(updatedFirstName);

    cy.contains('button', 'Update Student').click();

    // Verify that the updated student is displayed.
    cy.url().should('match', /\/students\/\d+$/);

    cy.contains('mat-card-title', 'Student Details')
      .should('be.visible');

    cy.contains(updatedFirstName).should('be.visible');
    cy.contains(student.lastName).should('be.visible');

    // 5. Return to the list.
    cy.contains('a', 'Back to list').click();

    cy.contains('Student Management').should('be.visible');

    // Locate this student's row and delete it.
    cy.contains('tr', student.cardNumber)
      .should('be.visible')
      .within(() => {
        cy.get('button[aria-label="Delete student"]').click();
      });

    // Confirm the deletion dialog.
    cy.on('window:confirm', () => true);

    // Verify that the student is no longer in the list.
    cy.contains('tr', student.cardNumber).should('not.exist');    

  });
});