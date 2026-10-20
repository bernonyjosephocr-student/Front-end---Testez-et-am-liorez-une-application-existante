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

    cy.get('.mat-mdc-snack-bar-container').should('contain.text', 'Student deleted successfully.');
  });

  it('should not delete a student when deletion is cancelled', () => {
    cy.intercept('GET', '/api/students', {
        statusCode: 200,
        body: [student]
    }).as('getStudentsWithStudent');

    cy.visit('/students');
    cy.wait('@getStudentsWithStudent');

    cy.on('window:confirm', () => false);

    cy.contains('tr', student.cardNumber)
        .should('be.visible')
        .within(() => {
        cy.get('button[aria-label="Delete student"]').click();
        });

    cy.get('@deleteStudent.all').should('have.length', 0);

    cy.contains('tr', student.cardNumber).should('be.visible');
  });

  it('should display a notification when deleting a student fails', () => {
    cy.intercept('GET', '/api/students', {
        statusCode: 200,
        body: [student]
    }).as('getStudentsWithStudent');

    cy.intercept('DELETE', '/api/students/1', {
        statusCode: 500,
        body: { message: 'Internal server error' }
    }).as('deleteStudentError');

    cy.visit('/students');
    cy.wait('@getStudentsWithStudent');

    cy.on('window:confirm', () => true);

    cy.contains('tr', student.cardNumber)
        .should('be.visible')
        .within(() => {
        cy.get('button[aria-label="Delete student"]').click();
        });

    cy.wait('@deleteStudentError');

    cy.get('.mat-mdc-snack-bar-container')
        .should('contain.text', 'Unable to delete the student.');

    cy.contains('tr', student.cardNumber).should('be.visible');
  });

  it('should display a message when the student ID is invalid', () => {
    cy.visit('/students/abc');

    cy.contains('Invalid student ID.').should('be.visible');
  });

  it('should display a message when student details cannot be loaded', () => {
    cy.intercept('GET', '/api/students/1', {
        statusCode: 500,
        body: { message: 'Internal server error' }
    }).as('getStudentError');

    cy.visit('/students/1');

    cy.wait('@getStudentError');

    cy.contains('Unable to load student details.').should('be.visible');
  });

  it('should not create a student when the form is invalid', () => {
    cy.intercept('POST', '/api/students').as('createStudentAttempt');

    cy.visit('/students/new');

    cy.contains('button', 'Create Student').click();

    cy.get('input[formControlName="cardNumber"]').should('exist');

    cy.get('@createStudentAttempt.all').should('have.length', 0);
  });

  it('should display an error when the student ID is invalid', () => {
    cy.visit('/students/abc');

    cy.contains('Invalid student ID.').should('be.visible');
  });  

  it('should navigate to the students list when the created student has no ID', () => {
    cy.intercept('POST', '/api/students', {
        statusCode: 201,
        body: { ...student, id: undefined }
    }).as('createStudentWithoutId');

    cy.visit('/students/new');

    // Fill in the form using the existing student fixture.
    cy.get('input[formControlName="cardNumber"]').type(student.cardNumber);
    cy.get('input[formControlName="firstName"]').type(student.firstName);
    cy.get('input[formControlName="lastName"]').type(student.lastName);
    cy.get('input[formControlName="dateOfBirth"]').type(student.dateOfBirth);
    cy.get('input[formControlName="email"]').type(student.email);
    cy.get('input[formControlName="phoneNumber"]').type(student.phoneNumber);

    cy.get('textarea[formControlName="homeAddress"]').type(student.homeAddress);

    cy.get('mat-select[formControlName="membershipType"]').click();
    cy.get('mat-option').contains('Premium').click();

    cy.get('input[formControlName="studentCardNumber"]').type(student.studentCardNumber);
    cy.get('input[formControlName="studentCardExpiryDate"]').type(student.studentCardExpiryDate);
    cy.get('input[formControlName="membershipExpiryDate"]').type(student.membershipExpiryDate);

    cy.get('mat-select[formControlName="accountStatus"]').click();
    cy.get('mat-option').contains('Active').click();

    cy.contains('button', 'Create Student').click();

    cy.wait('@createStudentWithoutId');

    cy.url().should('match', /\/students\/?$/);
  });
  
  it('should display a message when the student card number already exists', () => {
    cy.intercept('POST', '/api/students', {
        statusCode: 409,
        body: { message: 'Conflict' }
    }).as('createStudentConflict');

    cy.visit('/students/new');

    // Fill in the form using the existing fixture.
    cy.get('input[formControlName="cardNumber"]').type(student.cardNumber);
    cy.get('input[formControlName="firstName"]').type(student.firstName);
    cy.get('input[formControlName="lastName"]').type(student.lastName);
    cy.get('input[formControlName="dateOfBirth"]').type(student.dateOfBirth);
    cy.get('input[formControlName="email"]').type(student.email);
    cy.get('input[formControlName="phoneNumber"]').type(student.phoneNumber);
    cy.get('textarea[formControlName="homeAddress"]').type(student.homeAddress);

    cy.get('mat-select[formControlName="membershipType"]').click();
    cy.get('mat-option').contains('Premium').click();

    cy.get('input[formControlName="studentCardNumber"]').type(student.studentCardNumber);
    cy.get('input[formControlName="studentCardExpiryDate"]').type(student.studentCardExpiryDate);
    cy.get('input[formControlName="membershipExpiryDate"]').type(student.membershipExpiryDate);

    cy.get('mat-select[formControlName="accountStatus"]').click();
    cy.get('mat-option').contains('Active').click();

    cy.contains('button', 'Create Student').click();

    cy.wait('@createStudentConflict');

    cy.contains('A student with this card number already exists.')
        .should('be.visible');
  }); 
  
});