describe('Channel Management', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123');
      cy.visit('/server/12345/category/67890'); // Replace with your server and category ID
    });
  
    it('should create a new text channel', () => {
      cy.get('.create-channel-button').click();
      cy.get('#channel-name').type('Test Channel');
      cy.get('#create-channel-submit').click();
      cy.get('.channel-list').should('contain', 'Test Channel');
    });
  
    it('should delete a text channel', () => {
      cy.get('.channel-item').contains('Test Channel').click();
      cy.get('.delete-channel-button').click();
      cy.get('.confirm-delete').click();
      cy.get('.channel-list').should('not.contain', 'Test Channel');
    });
  });
  