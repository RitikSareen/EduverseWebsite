/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user.
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
  
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/auth/show/signIn'); // Navigate to the login page
    cy.get('#username').type(email); // Enter the email
    cy.get('#password').type(password); // Enter the password
    cy.get('#login-button').click(); // Click the login button
});
