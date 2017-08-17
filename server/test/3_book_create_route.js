import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';

import server from '../bin/bin';
import bookSeeders from '../seeders/book';
import models from '../models';
import userSeeders from '../seeders/user';

const UserModel = models.User;

const assert = chai.assert;
chai.use(chaiHttp);

describe('book routes', () => {
  let adminToken;
  let userToken;
  before((done) => {
    // create an admin user before running everything below
    // and sign admin user in, assigning the returned token
    UserModel.create({
      username: 'user01',
      password: bcrypt.hashSync('javascript', 10),
      admin: true,
      membershipLevel: 'regular',
      email: 'user01@mail.com'
    }).then((user) => {
      chai.request(server)
        .post('/api/users/signin')
        .type('form')
        .send({
          username: user.username,
          password: 'javascript'
        })
        .end((err, res) => {
          adminToken = res.body.token;
          chai.request(server)
            .post('/api/users/signin')
            .type('form')
            .send({
              username: userSeeders.signIn.fullSigninDetails.username,
              password: userSeeders.signIn.fullSigninDetails.password
            })
            .end((err, res) => {
              userToken = res.body.token;
              done();
            });
        });
    }).catch(error => done(error));
  });

  describe('POST /api/books', () => {
    it('should return 401 with no access token', (done) => {
      chai.request(server)
        .post('/api/books')
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          done();
        });
    });

    it('should return 403 with user token', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          done();
        });
    });

    it('should return 400 when no data is supplied', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return 400 when no title is supplied', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send(bookSeeders.createBook.nullTitle)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return 400 when no quantity is supplied', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send(bookSeeders.createBook.nullQuantity)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return 400 with negative quantity', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send(bookSeeders.createBook.negativeQuantity)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return 201 with full book details', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send(bookSeeders.createBook.fullBookDetails)
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          assert.equal(res.body.message, 'book added successfully');
          done();
        });
    });

    it('should return 400 with existing book title', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send(bookSeeders.createBook.fullBookDetails)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'another book with this title exists');
          done();
        });
    });
  });

  describe('PUT /api/books/:bookId', () => {
    it('should return 401 with no access token', (done) => {
      chai.request(server)
        .put('/api/books/')
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          done();
        });
    });

    it('should return 403 with user token', (done) => {
      chai.request(server)
        .put('/api/books/1')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          done();
        });
    });

    it('should return 404 with no book id', (done) => {
      chai.request(server)
        .put('/api/books/')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 404);
          done();
        });
    });

    it('should return 400 with non-int bookId param', (done) => {
      chai.request(server)
        .put('/api/books/string')
        .type('form')
        .send({
          title: 'Javascript'
        })
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          done();
        });
    });

    it('should return 200 with no body params', (done) => {
      chai.request(server)
        .put('/api/books/1')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('should return 201 with quantity set to 5', (done) => {
      chai.request(server)
        .put('/api/books/1')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send({
          quantity: 5
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.exists(res.body.data);
          done();
        });
    });
  });
});
