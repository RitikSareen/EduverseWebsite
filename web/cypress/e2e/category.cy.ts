describe('Category Management', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123'); // Add a custom command for login
      cy.visit('/server/12345'); // Replace with your server ID
    });
  
    it('should create a new category', () => {
      cy.get('.create-category-button').click();
      cy.get('#category-name').type('Test Category');
      cy.get('#create-category-submit').click();
      cy.get('.category-list').should('contain', 'Test Category');
    });
  
    it('should delete a category', () => {
      cy.get('.category-item').contains('Test Category').click();
      cy.get('.delete-category-button').click();
      cy.get('.confirm-delete').click();
      cy.get('.category-list').should('not.contain', 'Test Category');
    });
  });
  