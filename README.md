# Paypal Checkout Button Proof of Concept 2017

## The use case this example covers
You need a payment gateway that handles all of the sensitive business of taking a payment off of your website. But you also need to be able to pass custom data like a User ID over the payment gateway so that when the payment gateway notifies your server of a payment, your custom app knows which user account to apply that credit to. 

Using Paypal's HTML Buttons and Instant Payment Notification (IPN) service we get what we need. 

## About the Paypal functions

### Paypal's HTML Buttons (should have been called Paypal's Invoice API)
Paypal's "HTML Buttons" is not really a button, it's a web service that lives at `https://www.paypal.com/cgi-bin/webscr` and when a browser POSTs variables to that endpoint, it generates a checkout page according to the variables the web browser POSTed. Browsers POST variables to endpoints using the old fashioned `<form>` element with `<input>` elements as variables. Using a form element, you build the Paypal HTML Button making the submit button of your form the only visible element. The API for Paypal's "HTML Buttons" endpoint is interacted with by putting lots of hidden fields in that form like `<input type="hidden" name="variableName" value="variableValue">`. You will use variables to define things like the checkout total, the product name, and many others. Most exciting is the `custom` variable which you can populate with contextual data from your website like User ID so when a transaction is completed, the record of that transaction is stored with your custom data. Think of building a `<form>` element as building an invoice template that when a user submits, they pay a copy of that invoice template. See the full list of variables you can use [here](https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/). 
 and [read up on the only Doc page I think is worth reading in the Paypal docs despite it being four clicks deep in the navigation](https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/formbasics/). 

note: Watch out for what you put in the `cmd` variable, depending on what variable option you pick for that, the API changes. For example, a `cmd` variable value of `_xclick` will cause Paypal to expect you are going to describe a single product in your variables where a `cmd` vaiable value of `_cart` will expect multiple products. 

### Paypal's Instant Payment Notification (IPN) service
This is Paypal's robot that calls home to your server when something happens on Paypal's website related to your account. In this example repository, Paypal will call back to your server about a payment that has been made. Paypal's IPN robot knows where to call home because of the URL `notify_url` variable you generate in your Paypal HTML Button. In our example this `notify_url` is `<your server's addres>/api/ipn`. 

Check out the `./server.js` file in this repository and not the handler for the `/api/ipn` route. There is a generic `console.log` in there to spit out the message Paypal is going to send you but there is also this a `ipn.verify` method that gets called. That's there so when Paypal sends you a message, you send back the exact same message to confirm that received the message and all of your processing is done. If you don't send that message back, Paypal will keep sending the same message.  

## Getting Started 
Before you start you'll need to register for a regular old Paypal account and then upgrade it to a Paypal Business account to activate these two capabilities on your account. You'll want to clone this repository to a machine that has a publicly addressable IP Address/domain so when you finish checking out, Paypal's server can call back to yours with info about the transaction.  Then modify the `./app/checkout.html` file and replace `<your account email address>` and `<your server's IP address or domain>` with your own info. Install dependencies with `npm install` command then run `node server.js` command. 


## Running through the example
This proof of concept publishes a server with two HTML pages in the `app` folder and one web service that the Paypal servers call back to when a payment has been made.  

The flow is as follows:

Customer visits `/checkout.html` and clicks the `buy now` button. Because the `buy now` button is an HTML form with a lot of hidden inputs that describe things like what they are buying and how much, their browser POSTs to Paypal's servers where they are then redirected to a checkout page configured according to the variables their browser just POSTed. The Customer now follows the checkout process on the Paypal page, a process that results in a Payment to the account configured on the `buy now` button. Because the `buy now` button has a `notify_url` variable, the Paypal's Instant Payment Notification (IPN) servers POST back to the URL defined in the `notify_url` variable. 

If you run this example server yourself and go through checkout, you'll notice a console log occurs containing the message that Paypal's IPN server passes over. That POST from IPN contains a JSON object with information about the transaction. Of particular interest to us is the `custom` property that contains the same information we provided as a variable in the `buy now` button. For this example we populated the `custom` variable with `{"userId":"bob"}` but in our dynamic application that is capable of User sessions we would generate a `buy now` button with the User ID of our actual logged in User. 

At this point the User's browser is still on the Paypal webite viewing a summary page of the transaction. On that page they also shown a "return to merchant" button that links back to the `return` variable defined in your HTML Button form. 

