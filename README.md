# Swapping-Auction
Vision: Swap your old stuff. Get new stuff you LOVE

Domain: Content Swapping Domain

# Stage 1
  Creating a set of static HTML5 pages which serves as look-and-feel design prototype for later functional/dynamic application development
  
  Common look-and-feel elements are rendered exactly the same, to show the seamless transitions with no jitter between pages for common elements.
  
  
# Stage 2
  Serving views and defining routes
  
  Implement MVC Design Pattern to structure the web application.
  
    Model - JavaScript Data Objects to implement the business layer of the application
    View -  EJS Pages to present the view to the browser
    Control - Using Routes to control the flow of the application
  
  We will define EJS Pages for the presentation, routes for the controller and JavaScript data objects for the business logic
  
 
# Stage 3
  Implement sessions to maintain state in our application

  Complete MVC Architecture

  [MVC Design](https://i.imgur.com/eA4sb7D.png)

# Stage 4

  Database Integration - Ability to organize collection of information to access, manage and update

  Persistent Data Storage using MongoDB (NoSQL) with help of mongoose js

# Stage 5

  Secure Application - Implementing security measures to enhance the application robustness to security attacks.

# Testing
  Validation of HTML5 pages by following tool: http://html5.validator.nu/
  
  Cross-browser checking for Firefox and Chrome


# Design Principles
  Complete separation of CSS into separate files. No inline styles.
  
  Complete separation of JS into separate files. No inline scripting.
  
  All resources(locally stored within the web application) like local copies of JS libraries
  
  Coding efficient and design choices, which includes coding elegance or style.
  
  Good code design is followed for maintenance, understanding, reusability, and extensibility of applications.
  
  Proper indentation for nested elements.
  
 
# Fundamental Standards for Web page design
  All the pages are valid HTML5 standard
  
  Cross-browser Compatibility
  
  Mobile Responsive

# Steps to install Project
  Before cloning the project, you should install node, mongodb libraries.

  1. Clone the project
  
  2. ``npm install``

  3. Use the [``hw4_create_db.txt``](https://github.com/tech-boy/Swapping-Auction/blob/master/hw4_create_db.txt) file to insert the documents in the mongodb database

  4. inside the root folder -> ``nodemon controls/app``
