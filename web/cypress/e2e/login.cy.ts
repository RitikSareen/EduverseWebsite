describe('Login Page', () => {
  it('should allow user to log in successfully', () => {
      cy.visit('/auth/show/signIn'); // Navigate to the login page
      cy.get('#username').type('testuser'); // Enter valid username
      cy.get('#password').type('password123'); // Enter valid password
      cy.get('#login-button').click(); // Click the login button
      cy.url().should('include', '/dashboard'); // Verify redirection to the dashboard
  });

  it('should show an error for invalid credentials', () => {
      cy.visit('/auth/show/signIn'); // Navigate to the login page
      cy.get('#username').type('wronguser'); // Enter invalid username
      cy.get('#password').type('wrongpassword'); // Enter invalid password
      cy.get('#login-button').click(); // Click the login button
      cy.get('.error-message').should('contain', 'Invalid credentials'); // Verify error message
  });

  it('should show an error for empty username', () => {
      cy.visit('/auth/show/signIn'); // Navigate to the login page
      cy.get('#password').type('password123'); // Enter valid password
      cy.get('#login-button').click(); // Click the login button
      cy.get('.error-message').should('contain', 'Username is required'); // Verify error message
  });

  it('should show an error for empty password', () => {
      cy.visit('/auth/show/signIn'); // Navigate to the login page
      cy.get('#username').type('testuser'); // Enter valid username
      cy.get('#login-button').click(); // Click the login button
      cy.get('.error-message').should('contain', 'Password is required'); // Verify error message
  });

  it('should navigate to the signup page', () => {
      cy.visit('/auth/show/signIn'); // Navigate to the login page
      cy.get('#signup-link').click(); // Click the signup link
      cy.url().should('include', '/auth/show/signUp'); // Verify redirection to the signup page
  });
});