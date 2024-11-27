describe('Server Management', () => {
    beforeEach(() => {
      cy.visit('/signIn'); // Navigate to the login page
      cy.get('#username').type('your-username');
      cy.get('#password').type('your-password');
      cy.get('#login-button').click();
    });
  
    it('should create a new server', () => {
      cy.visit('/servers');
      cy.get('.create-server-button').click();
      cy.get('#server-name').type('Test Server');
      cy.get('#server-description').type('This is a test server');
      cy.get('#create-server-submit').click();
      cy.get('.server-list').should('contain', 'Test Server');
    });
  
    it('should delete an existing server', () => {
      cy.visit('/servers');
      cy.get('.server-item').contains('Test Server').click();
      cy.get('.delete-server-button').click();
      cy.get('.confirm-delete').click();
      cy.get('.server-list').should('not.contain', 'Test Server');
    });
  });
  