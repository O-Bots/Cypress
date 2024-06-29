let genArr = [];

function createUser () {
    //Click on Login
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(3).click();

    //Check that New User signup is visible
    cy.get('.signup-form').should('exist').within(function () {
      
      //Start the signup process, enter Account name and Email
      cy.get('[type="text"]').type(this.accountDetails.account_name);
      cy.get('input').eq(2).type(this.accountDetails.email);
      cy.get('button').click();
    });

    //Enter Account information
    cy.get('.login-form').should('exist');

    //Grab the Label information for prefixes
    cy.get('.radio-inline > label').then((item) => {
      for (let i = 0; i < item.length; i++) {
        const itemDetails = {
          prefix: item[i].outerText,
          attribute: item[i].getAttribute("for")
        }
        genArr.push(itemDetails);        
      };
    });

    //Select a random prefix
    cy.get('.clearfix').within(()=> {
      const rngGen = Math.floor(Math.random() * genArr.length);
      cy.get('.radio-inline').find(`[for=${genArr[rngGen].attribute}]`).click()
    });

    //Enter password
    cy.get('.login-form').within(function () {
      //Password
      cy.get('[data-qa=password]').type(this.accountDetails.password);

    });

    //Enter Date of birth
    cy.get('#uniform-days').within(function () {
      cy.get('select[data-qa=days]').select(this.accountDetails.dob.days);
    });
    cy.get('#uniform-months').within(function () {
      cy.get('select[data-qa=months]').select(this.accountDetails.dob.months);
    });
    cy.get('#uniform-years').within(function () {
      cy.get('select[data-qa=years]').select(this.accountDetails.dob.years);
    });

    //Check signup for news letter and receive special offers
    cy.get('input#newsletter').check();
    cy.get('input#optin').check();

    //Enter address information
    cy.get('.login-form').within(function () {
      cy.get('[data-qa=first_name]').type(this.accountDetails.first_name);
      cy.get('[data-qa=last_name]').type(this.accountDetails.last_name);
      cy.get('[data-qa=company]').type(this.accountDetails.company);
      cy.get('[data-qa=address]').type(this.accountDetails.address);
      cy.get('select[data-qa=country]').select(this.accountDetails.country);
      cy.get('[data-qa=state]').type(this.accountDetails.state);
      cy.get('[data-qa=city]').type(this.accountDetails.city);
      cy.get('[data-qa=zipcode]').type(this.accountDetails.zipcode);
      cy.get('[data-qa=mobile_number]').type(this.accountDetails.mobile_number);
    });

    //Click create account
    cy.get('[data-qa=create-account]').click();

    //Confirm account as been created
    cy.get('[data-qa=account-created]').should('be.visible');

    //Click contiue
    cy.get('[data-qa=continue-button]').click();

    //Confirm account name
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(9).within(function () {
      cy.get('a').find('b').should('have.text', this.accountDetails.account_name);
    });
}
describe('Account functionality works as expected', () => {

  beforeEach(() =>{
    //Accessing account information stored in fixture folder
    cy.fixture('accountDetails').then(function (data) {
      this.accountDetails = data
    });

    //Navigates to the baseUrl stored in the cypress.config file
    cy.visit('/');

    //Check If the page has loaded
    cy.get('div').should('have.class', 'logo pull-left');
  });
  it('Sucessfully registers a new user and deletes the account', () => {
    //Create user Function
    createUser();

    //Delete account
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(4).click();

    //Confirm account as been deleted
    cy.get('[data-qa=account-deleted]').should('be.visible');

    //Click contiue
    cy.get('[data-qa=continue-button]').click();
  });

  it('Successfully registers a new user', () => {
    //Create user Function
    createUser();
  });

  it('Successfully logs in user with incorrect details', () => {
    //Click log in
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(3).click();

    //Enter login details
    cy.get('.login-form').within(function () {
      cy.get('[data-qa=login-email]').type(this.accountDetails.email);
      cy.get('[data-qa=login-password]').type(this.accountDetails.password+1);
      cy.get('[data-qa=login-button]').click();
      
      //Confirm incorrect login
      cy.get('p').should('be.visible');
    });
  });

  it('Successfully fails to register a user with an already used email', () => {
    //Click on Login
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(3).click();

    //Check that New User signup is visible
    cy.get('.signup-form').should('exist').within(function () {
      
      //Start the signup process, enter Account name and Email
      cy.get('[type="text"]').type(this.accountDetails.account_name);
      cy.get('input').eq(2).type(this.accountDetails.email);
      cy.get('button').click();

    });
    //Confirm email already exists
    cy.get('.signup-form').find('p').should('have.text', 'Email Address already exist!');
  });

  it('Successfully logs in user with correct details and deletes the account', () => {
    //Click log in
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(3).click();

    //Enter login details
    cy.get('.login-form').within(function () {
      cy.get('[data-qa=login-email]').type(this.accountDetails.email);
      cy.get('[data-qa=login-password]').type(this.accountDetails.password);
      cy.get('[data-qa=login-button]').click();
    });

    //Confirm account details
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(9).within(function (){
      cy.get('b').should('have.text', this.accountDetails.account_name);
    });

    //Delete account
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(4).click();

    //Confirm account as been deleted
    cy.get('[data-qa=account-deleted]').should('be.visible');

    //Click contiue
    cy.get('[data-qa=continue-button]').click();
  });

});