https://travis-ci.org/idrisadetunmbi/HelloBooks.svg?branch=master <a href='https://coveralls.io/github/idrisadetunmbi/HelloBooks?branch=server-development'><img src='https://coveralls.io/repos/github/idrisadetunmbi/HelloBooks/badge.svg?branch=server-development' alt='Coverage Status' /></a>

# HelloBooks
Andela HelloBooks Bootcamp project

This project is a demo of a library management app written using Node JS. The project is still in its development stage. Currently, the front end and back end are not connected yet. 

The front end is just a mock of the full app and a demo can be accessed through https://idrisadetunmbi.github.io/HelloBooks/

Back end is a RESTful api server which can be accessed through https://hellobooks-server-demo.herokuapp.com/

All routes to the back end server will return with an "invalid token..." response except the following:

  path: [ '/', '/api/users/signup', '/api/users/signin', '/api/', '/api/books/', '/api/users/']

Other routes expect a jsonwebtoken to work and routes that have not been implemented will return with a 404.
