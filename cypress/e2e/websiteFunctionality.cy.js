let genArr = [];
let productArr = [];
let productRng;

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
};

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

  it('Successfully searches for a product', () => {
    //Navigate to the products page
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(1).click();

    //Confirm the page is correct
    cy.get('div[class=features_items]').find('h2').first().should('have.text', 'All Products');

    //Gather product information
    cy.get('div[class=single-products]').find('.productinfo.text-center').each( (item) => {
      for (let i = 0; i < item.length; i++) {
        const productInfo = {
          name: item.find('p').text(),
          price: item.find('h2').text()
        }
        productArr.push(productInfo);
      };
    });

    //Search for a product
    cy.get('.container').eq(1).within(() => {
      const rngProduct = Math.floor(Math.random()* productArr.length);
      productRng=rngProduct
      cy.get('#search_product').type(productArr[productRng].name);
      cy.get('#submit_search').click();
      
    });

    //Confirm that page and correct product is showing
    cy.get('.features_items').within(() =>{
      cy.get('h2').first().should('be.visible').contains('SEARCHED PRODUCTS', {matchCase: false});

      //Confirm that only one product is showing
      cy.get('div').find('.col-sm-4').should('have.length', 0);

      cy.get('div[class=single-products]').find('.productinfo.text-center').within(() => {

        cy.get('h2').should('have.text', productArr[productRng].price)
        cy.get('p').should('have.text', productArr[productRng].name)
      });
      
    });
  });

  it('Successfully subscribes to the email list while on the home page', () => {
    //Scroll down to the subscribe section of the home page
    cy.get('#susbscribe_email').scrollIntoView();

    //Verify the text Subscription is visible
    cy.get('.single-widget').within(function () {
      cy.get('h2').first().should('have.text', 'Subscription');

      //Enter email address and subscribe
      cy.get('input[id=susbscribe_email]').type(this.accountDetails.email);
  
      //Click on submit
      cy.get('button[type=submit][id=subscribe]').click()

    })
    //Confirm success message
    cy.get('.alert-success.alert').should('be.visible');
  });

  it('Successfully subscribes to the email list while on the cart page', () => {

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Verify the text Subscription is visible
    cy.get('.single-widget').within(function () {
      cy.get('h2').first().should('have.text', 'Subscription');

      //Enter email address and subscribe
      cy.get('input[id=susbscribe_email]').type(this.accountDetails.email);
  
      //Click on submit
      cy.get('button[type=submit][id=subscribe]').click()

    })
    //Confirm success message
    cy.get('.alert-success.alert').should('be.visible');
  });

  it('Successfully adds products to the cart', () => {

    //Navigate to the products page
    cy.get('.nav.navbar-nav').find('li').eq(1).click();

    //Grab product information
    cy.get('.productinfo.text-center').eq(0).within(function (item) {
      this.firstProductName = item.find('p').text();
      this.firstProductPrice = item.find('h2').text();

      //Add the first product to the cart
      cy.get('.btn.btn-default.add-to-cart').click()
    })

    //Close the Contiune shopping modal
    cy.get('.modal-footer').find('button').click()

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.firstProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.firstProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
        cy.get('td[class=cart_total]').find('p').should('have.text', this.firstProductPrice);
      })
    })
  });

  it('Successfully shows the correct quantity on the cart page', () => {

    //Gather information of all products on the home page
    cy.get('.product-image-wrapper').then((item) => {
      const rngProductQuantity = Math.floor(Math.random() * item.length)

      //Choose one product
      cy.get(item[rngProductQuantity]).within(() => {

        //Grab product information
        cy.get('.productinfo.text-center').within(function (item) {
          this.randomProductName = item.find('p').text();
          this.randomProductPrice = item.find('h2').text();
        })
        cy.get('.choose').click();
      })
    });

    //Confirm product information
    cy.get('.product-information').should('be.visible').within(function () {
      cy.get('h2').first().should('have.text', this.randomProductName);
      cy.get('span').first().find('span').should('have.text', this.randomProductPrice);
    });

    //Edit the quantity
    cy.get('#quantity').clear().type(4);

    //Add product to cart
    cy.get('.btn.btn-default.cart').click();

    //Close the Contiune shopping modal
    cy.get('.modal-footer').find('button').click()

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 4);
      });
    });
  });

  it('Successfully register an account while at the checkout', () => {

    //Gather information of all products on the home page
    cy.get('.features_items').within(() => {
      cy.get('.product-image-wrapper').then((item) => {
        const rngProductQuantity = Math.floor(Math.random() * item.length)
  
        //Choose one product
        cy.get(item[rngProductQuantity]).within(() => {
  
          //Grab product information
          cy.get('.productinfo.text-center').within(function (item) {
            this.randomProductName = item.find('p').text();
            this.randomProductPrice = item.find('h2').text();
  
            //Add to cart
            cy.get('.btn.btn-default.add-to-cart').click()
          });
        });
      });
    });

    //Close the Contiune shopping modal
    cy.get('.modal-footer').find('button').click()

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

    //Create user function
    createUser();

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Proceed to checkout
    cy.get('.btn.btn-default.check_out').click();

    //Confirm details are correct
    cy.get('[data-qa=checkout-info]').within(() => {
      cy.get('ul[id=address_delivery]').within(function (item) {
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.first_name);
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.last_name);
        expect(item.find('li').eq(2).text()).to.contain(this.accountDetails.company);
        expect(item.find('li').eq(3).text()).to.contain(this.accountDetails.address);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.state);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.city);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.zipcode);
        expect(item.find('li').eq(6).text()).to.contain(this.accountDetails.country);
        expect(item.find('li').eq(7).text()).to.contain(this.accountDetails.mobile_number);
      });
      cy.get('ul[id=address_invoice]').within(function (item) {
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.first_name);
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.last_name);
        expect(item.find('li').eq(2).text()).to.contain(this.accountDetails.company);
        expect(item.find('li').eq(3).text()).to.contain(this.accountDetails.address);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.state);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.city);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.zipcode);
        expect(item.find('li').eq(6).text()).to.contain(this.accountDetails.country);
        expect(item.find('li').eq(7).text()).to.contain(this.accountDetails.mobile_number);
      });
    });

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

    //Check the order message functionality
    cy.get('#ordermsg').find('textarea').type('Description');

    //Click place order
    cy.get('.btn.btn-default.check_out').click();

    //Enter payment information
    cy.get('#payment-form').within(function () {
      cy.get('[data-qa=name-on-card]').type(this.accountDetails.first_name, this.accountDetails.last_name);
      cy.get('[data-qa=card-number]').type(this.accountDetails.paymentDetails.card_number);
      cy.get('[data-qa=cvc]').type(this.accountDetails.paymentDetails.card_cvc);
      cy.get('[data-qa=expiry-month]').type(this.accountDetails.paymentDetails.card_expiry_month);
      cy.get('[data-qa=expiry-year]').type(this.accountDetails.paymentDetails.card_expiry_year);
      cy.get('[data-qa=pay-button]').click();
    });

    //Confirm order has been placed
    cy.get('.title.text-center').should('have.text', 'Order Placed!');

    //Delete account
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(4).click();

    //Confirm account as been deleted
    cy.get('[data-qa=account-deleted]').should('be.visible');

    //Click contiue
    cy.get('[data-qa=continue-button]').click();
  });

  it('Successfully registers a new account and goes through the order flow', () => {
    //Create user function
    createUser();

    //Gather information of all products on the home page
    cy.get('.features_items').within(() => {
      cy.get('.product-image-wrapper').then((item) => {
        const rngProductQuantity = Math.floor(Math.random() * item.length)

        //Choose one product
        cy.get(item[rngProductQuantity]).within(() => {

          //Grab product information
          cy.get('.productinfo.text-center').within(function (item) {
            this.randomProductName = item.find('p').text();
            this.randomProductPrice = item.find('h2').text();

            //Add to cart
            cy.get('.btn.btn-default.add-to-cart').click()
          });
        });
      });
    });

    //Close the Contiune shopping modal
    cy.get('.modal-footer').find('button').click()

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

   //Proceed to checkout
    cy.get('.btn.btn-default.check_out').click();

    //Confirm details are correct
    cy.get('[data-qa=checkout-info]').within(() => {
      cy.get('ul[id=address_delivery]').within(function (item) {
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.first_name);
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.last_name);
        expect(item.find('li').eq(2).text()).to.contain(this.accountDetails.company);
        expect(item.find('li').eq(3).text()).to.contain(this.accountDetails.address);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.state);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.city);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.zipcode);
        expect(item.find('li').eq(6).text()).to.contain(this.accountDetails.country);
        expect(item.find('li').eq(7).text()).to.contain(this.accountDetails.mobile_number);
      });
      cy.get('ul[id=address_invoice]').within(function (item) {
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.first_name);
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.last_name);
        expect(item.find('li').eq(2).text()).to.contain(this.accountDetails.company);
        expect(item.find('li').eq(3).text()).to.contain(this.accountDetails.address);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.state);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.city);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.zipcode);
        expect(item.find('li').eq(6).text()).to.contain(this.accountDetails.country);
        expect(item.find('li').eq(7).text()).to.contain(this.accountDetails.mobile_number);
      });
    });

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

    //Check the order message functionality
    cy.get('#ordermsg').find('textarea').type('Description');

    //Click place order
    cy.get('.btn.btn-default.check_out').click();

    //Enter payment information
    cy.get('#payment-form').within(function () {
      cy.get('[data-qa=name-on-card]').type(this.accountDetails.first_name, this.accountDetails.last_name);
      cy.get('[data-qa=card-number]').type(this.accountDetails.paymentDetails.card_number);
      cy.get('[data-qa=cvc]').type(this.accountDetails.paymentDetails.card_cvc);
      cy.get('[data-qa=expiry-month]').type(this.accountDetails.paymentDetails.card_expiry_month);
      cy.get('[data-qa=expiry-year]').type(this.accountDetails.paymentDetails.card_expiry_year);
      cy.get('[data-qa=pay-button]').click();
    });

    //Confirm order has been placed
    cy.get('.title.text-center').should('have.text', 'Order Placed!');

    //Delete account
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(4).click();

    //Confirm account as been deleted
    cy.get('[data-qa=account-deleted]').should('be.visible');

    //Click contiue
    cy.get('[data-qa=continue-button]').click();
  });

  it('Creates a new acccount', () => {
    //Create user function
    createUser();
  })
  it('Successfully log into an account and goes through the order flow', () => {

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

    //Gather information of all products on the home page
    cy.get('.features_items').within(() => {
      cy.get('.product-image-wrapper').then((item) => {
        const rngProductQuantity = Math.floor(Math.random() * item.length)

        //Choose one product
        cy.get(item[rngProductQuantity]).within(() => {

          //Grab product information
          cy.get('.productinfo.text-center').within(function (item) {
            this.randomProductName = item.find('p').text();
            this.randomProductPrice = item.find('h2').text();

            //Add to cart
            cy.get('.btn.btn-default.add-to-cart').click()
          });
        });
      });
    });

    //Close the Contiune shopping modal
    cy.get('.modal-footer').find('button').click()

    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

   //Proceed to checkout
    cy.get('.btn.btn-default.check_out').click();

    //Confirm details are correct
    cy.get('[data-qa=checkout-info]').within(() => {
      cy.get('ul[id=address_delivery]').within(function (item) {
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.first_name);
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.last_name);
        expect(item.find('li').eq(2).text()).to.contain(this.accountDetails.company);
        expect(item.find('li').eq(3).text()).to.contain(this.accountDetails.address);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.state);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.city);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.zipcode);
        expect(item.find('li').eq(6).text()).to.contain(this.accountDetails.country);
        expect(item.find('li').eq(7).text()).to.contain(this.accountDetails.mobile_number);
      });
      cy.get('ul[id=address_invoice]').within(function (item) {
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.first_name);
        expect(item.find('li').eq(1).text()).to.contain(this.accountDetails.last_name);
        expect(item.find('li').eq(2).text()).to.contain(this.accountDetails.company);
        expect(item.find('li').eq(3).text()).to.contain(this.accountDetails.address);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.state);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.city);
        expect(item.find('li').eq(5).text()).to.contain(this.accountDetails.zipcode);
        expect(item.find('li').eq(6).text()).to.contain(this.accountDetails.country);
        expect(item.find('li').eq(7).text()).to.contain(this.accountDetails.mobile_number);
      });
    });

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

    //Check the order message functionality
    cy.get('#ordermsg').find('textarea').type('Description');

    //Click place order
    cy.get('.btn.btn-default.check_out').click();

    //Enter payment information
    cy.get('#payment-form').within(function () {
      cy.get('[data-qa=name-on-card]').type(this.accountDetails.first_name, this.accountDetails.last_name);
      cy.get('[data-qa=card-number]').type(this.accountDetails.paymentDetails.card_number);
      cy.get('[data-qa=cvc]').type(this.accountDetails.paymentDetails.card_cvc);
      cy.get('[data-qa=expiry-month]').type(this.accountDetails.paymentDetails.card_expiry_month);
      cy.get('[data-qa=expiry-year]').type(this.accountDetails.paymentDetails.card_expiry_year);
      cy.get('[data-qa=pay-button]').click();
    });

    //Confirm order has been placed
    cy.get('.title.text-center').should('have.text', 'Order Placed!');

    //Delete account
    cy.get('ul').should('have.class', 'nav navbar-nav').find('li').eq(4).click();

    //Confirm account as been deleted
    cy.get('[data-qa=account-deleted]').should('be.visible');

    //Click contiue
    cy.get('[data-qa=continue-button]').click();
  });

  it('Successfully removes a product from the cart', () => {
    //Gather information of all products on the home page
    cy.get('.features_items').within(() => {
      cy.get('.product-image-wrapper').then((item) => {
        const rngProductOne = Math.floor(Math.random() * item.length)
        const rngProductTwo = Math.floor(Math.random() * item.length)
        
        if (rngProductOne === rngProductTwo) {
          //Choose one product
          cy.get(item[rngProductOne]).within(() => {
    
            //Grab product information
            cy.get('.productinfo.text-center').within(function (item) {
              this.randomProductOneName = item.find('p').text();
              this.randomProductOnePrice = item.find('h2').text();
    
              //Add to cart
              cy.get('.btn.btn-default.add-to-cart').click()
            });
          });

          //Close the Contiune shopping modal
          cy.get('.modal-footer').find('button').click()

          //Choose one product
          cy.get(item[rngProductTwo+1]).within(() => {
    
            //Grab product information
            cy.get('.productinfo.text-center').within(function (item) {
              this.randomProductTwoName = item.find('p').text();
              this.randomProductTwoPrice = item.find('h2').text();
    
              //Add to cart
              cy.get('.btn.btn-default.add-to-cart').click()
              
              //Close the Contiune shopping modal
              cy.get('.modal-footer').find('button').click() 
            });
          });
          
        } else {
          //Choose one product
          cy.get(item[rngProductOne]).within(() => {
    
            //Grab product information
            cy.get('.productinfo.text-center').within(function (item) {
              this.randomProductOneName = item.find('p').text();
              this.randomProductOnePrice = item.find('h2').text();
    
              //Add to cart
              cy.get('.btn.btn-default.add-to-cart').click()
            });
          });
          //Close the Contiune shopping modal
          cy.get('.modal-footer').find('button').click();

          //Choose one product
          cy.get(item[rngProductTwo]).within(() => {
    
            //Grab product information
            cy.get('.productinfo.text-center').within(function (item) {
              this.randomProductTwoName = item.find('p').text();
              this.randomProductTwoPrice = item.find('h2').text();
    
              //Add to cart
              cy.get('.btn.btn-default.add-to-cart').click();
            });
          });

          //Close the Contiune shopping modal
          cy.get('.modal-footer').find('button').click()
        };
      });
    });



    //Navigate to the cart page
    cy.get('.nav.navbar-nav').find('li').eq(2).click();

    //Confirm the cart has the correct prodcuts
    cy.get('.table.table-condensed').within(() => {
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductOneName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductOnePrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
      cy.get('tbody').find('tr').eq(1).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductTwoName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductTwoPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_delete]').find('a').click();
      });
      cy.get('tbody').find('tr').eq(0).within(function () {
        cy.get('td[class=cart_description]').find('a').should('have.text', this.randomProductTwoName);
        cy.get('td[class=cart_price]').find('p').should('have.text', this.randomProductTwoPrice);
        cy.get('td[class=cart_quantity]').find('button').should('have.text', 1);
      });
    });

  });


});