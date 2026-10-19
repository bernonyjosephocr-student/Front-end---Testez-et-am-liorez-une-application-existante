describe('Student management', () => {
  let student: any;


  beforeEach(() => {
    cy.fixture('student.json').then((fixture) => {
        student = fixture;
    });

    cy.intercept('POST', '/api/students', (req) => {
        student = { ...req.body, id: 1 };

        req.reply({
        statusCode: 201,
        body: student
        });
    }).as('createStudent');

    cy.intercept('GET', '/api/students/1', (req) => {
        req.reply({
        statusCode: 200,
        body: student
        });
    }).as('getStudent');

    cy.intercept('PUT', '/api/students/1', (req) => {
        student = { ...student, ...req.body, id: 1 };

        req.reply({
        statusCode: 200,
        body: student
        });
    }).as('updateStudent');

    cy.intercept('DELETE', '/api/students/1', {
        statusCode: 204,
        body: ''
    }).as('deleteStudent');

    cy.login();
  });

  it('should create a student', () => {
    cy.contains('a', 'Add student').click();

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

    cy.get('mat-select[formControlName="membershipType"]').click();
    cy.get('mat-option').contains('Premium').click();

    cy.get('input[formControlName="studentCardNumber"]')
      .type(student.studentCardNumber);

    cy.get('input[formControlName="studentCardExpiryDate"]')
      .type(student.studentCardExpiryDate);

    cy.get('input[formControlName="membershipExpiryDate"]')
      .type(student.membershipExpiryDate);

    cy.get('mat-select[formControlName="accountStatus"]').click();
    cy.get('mat-option').contains('Active').click();

    cy.contains('button', 'Create Student').click();

    cy.wait('@createStudent')
      .its('response.statusCode')
      .should('equal', 201);

    cy.url().should('include', '/students/1');
    cy.contains('mat-card-title', 'Student Details').should('be.visible');
    cy.contains(student.cardNumber).should('be.visible');
  });

  it('should update a student', () => {
    cy.visit('/students/1');

    cy.wait('@getStudent');

    cy.contains('Jean').should('be.visible');

    cy.contains('a', 'Edit Student').click();

    cy.get('input[formControlName="firstName"]')
      .clear()
      .type('Jean-Pierre');

    cy.contains('button', 'Update Student').click();

    cy.wait('@updateStudent')
      .its('response.statusCode')
      .should('equal', 200);

    cy.contains('Jean-Pierre').should('be.visible');
  });

  it('should delete a student', () => {
    // Replace the empty list response with a list containing our student.
    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [student]
    }).as('getStudentsWithStudent');

    cy.visit('/students');

    cy.wait('@getStudentsWithStudent');

    cy.on('window:confirm', () => true);

    cy.contains('tr', student.cardNumber)
      .should('be.visible')
      .within(() => {
        cy.get('button[aria-label="Delete student"]').click();
      });

    cy.wait('@deleteStudent')
      .its('response.statusCode')
      .should('equal', 204);

    cy.contains('tr', student.cardNumber).should('not.exist');
  });
});