let genArr = [];

describe('Website functionality works as expected', () => {
  beforeEach(() =>{
    //Accessing account information stored in fixture folder
    cy.fixture('accountDetails').then(function (data) {
      this.accountDetails = data
    });

    //Accessing contact us information stored in fixture folder
    cy.fixture('contactUsDetails').then(function (data) {
      this.contactUsDetails = data
    });

    //Navigates to the baseUrl stored in the cypress.config file
    cy.visit('/');

    //Check If the page has loaded
    cy.get('div').should('have.class', 'logo pull-left');
  });

  it('Successfully uses the contact us form', () => {
    //Select contact us
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(7).click();

    cy.get('div[class=contact-form]').within(function () {
      //Verify Get in touch is visible
      cy.get('h2').should('have.class', 'title text-center').should('have.text', 'Get In Touch');
      cy.get('[data-qa=name]').type(this.contactUsDetails.first_name);
      cy.get('[data-qa=email]').type(this.contactUsDetails.email);
      cy.get('[data-qa=subject]').type(this.contactUsDetails.subject);
      cy.get('[data-qa=message]').type(this.contactUsDetails.message);
      cy.get('[data-qa=submit-button]').click();

      //Confirm success message
      cy.get('div').eq(1).should('be.visible')
      .and('have.text', 'Success! Your details have been submitted successfully.');
    });
  });

  it('Successfully navigates to the Test Cases page', () => {
    //Navigate to Test case page
    cy.get('div[class=carousel-inner]').find('div')
    .should('have.class', 'item active')
    .find('a').eq(0).click();

    //Verify the page is correct
    cy.get('h2').should('have.class', 'title text-center').find('b').should('have.text', 'Test Cases');
  });

  it('Successfully navigates to the products page and view the details of a product', () => {
    //Navigate to the products page
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(1).click();

    //Confirm the page is correct
    cy.get('div[class=features_items]').find('h2').first().should('have.text', 'All Products');

    //Gather product information
    cy.get('div[class=single-products]').eq(0).find('div').eq(0).within(function (){
      cy.get('h2').then(function (data) {
        this.productPrice = data.text()
      });
      cy.get('p').then(function (data) {
        this.productName = data.text()
      });
    });

    //Select the first product
    cy.get('div[class=product-image-wrapper]').eq(0).find('ul > li').should('have.text', 'View Product').click();

    //Confirm product information
    cy.get('.product-information').should('be.visible').within(function () {
      cy.get('h2').first().should('have.text', this.productName);
      cy.get('span').first().find('span').should('have.text', this.productPrice);
    });
  });

});