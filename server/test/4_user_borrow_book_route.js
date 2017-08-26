import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../bin/bin';
import userSeeders from '../seeders/user';

const assert = chai.assert;
chai.use(chaiHttp);

describe('User Book Actions Routes', () => {
  let adminToken, userToken, userId, addedBookId;
  before((done) => {
    chai.request(server)
      .post('/api/users/signin')
      .type('form')
      .send({
        username: 'user01',
        password: 'javascript'
      })
      .end((err, res) => {
        adminToken = res.body.data.token;
        chai.request(server)
          .post('/api/users/signin')
          .type('form')
          .send({
            username: userSeeders.signIn.fullSigninDetails.username,
            password: userSeeders.signIn.fullSigninDetails.password
          })
          .end((err, res) => {
            userToken = res.body.data.token;
            userId = res.body.data.userId;
            done();
          });
      });
  });

  describe('POST /api/users/:userId/books - Book Borrowing', () => {
    it('should return 401 with no access token', (done) => {
      chai.request(server)
        .post('/api/users/:userId/books')
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          done();
        });
    });

    it('should return 403 with admin token', (done) => {
      chai.request(server)
        .post('/api/users/:userId/books')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          done();
        });
    });

    it('should return 403 with differing IDs (userId and parameter IDs)', (done) => {
      chai.request(server)
        .post('/api/users/1/books')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          done();
        });
    });

    it('should return 400 with non existing bookId (bookId: 21)', (done) => {
      chai.request(server)
        .post(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .type('form')
        .send({
          bookId: 21
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          done();
        });
    });

    it('should return 400 with no (0) book quantity', (done) => {
      chai.request(server)
        .post('/api/books')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .send({
          title: 'Effective Python',
          author: 'not available',
          description: 'not available',
          category: 'javascript',
          quantity: 0,
        })
        .end((err, res) => {
          addedBookId = res.body.data.id;
          assert.equal(res.statusCode, 201);
          chai.request(server)
            .post(`/api/users/${userId}/books`)
            .set('authorization', `Bearer ${userToken}`)
            .type('form')
            .send({
              bookId: addedBookId
            })
            .end((err, res) => {
              console.log(res.body);
              assert.equal(res.statusCode, 400);
              done();
            });
        });
    });

    it('should return 201 with valid user Id and book Id', (done) => {
      chai.request(server)
        .post(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .type('form')
        .send({
          bookId: 1
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          assert.exists(res.body.data);
          done();
        });
    });

    it('should return 403 for book that was previously borrowed ', (done) => {
      chai.request(server)
        .post(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .type('form')
        .send({
          bookId: 1
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          done();
        });
    });
  });

  describe('PUT /api/users/:userId/books', () => {
    it('should return 400 for a book a user did not borrow', (done) => {
      chai.request(server)
        .put(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .type('form')
        .send({
          bookId: addedBookId
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          done();
        });
    });

    it('should return 201 for a valid return book operation', (done) => {
      chai.request(server)
        .put(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .type('form')
        .send({
          bookId: 1
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          done();
        });
    });

    it('should return 400 for that was previously returned', (done) => {
      chai.request(server)
        .put(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .type('form')
        .send({
          bookId: 1
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          done();
        });
    });
  });

  describe('GET /api/users/:userId/books', () => {
    it('should allow an admin user get the list of user borrowed books', (done) => {
      chai.request(server)
        .get(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.exists(res.body.data);
          done();
        });
    });

    it('should return 400 for a non-existing user', (done) => {
      chai.request(server)
        .get('/api/users/1/books')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          console.log(res.body);
          assert.equal(res.statusCode, 400);
          done();
        });
    });

    it('should return 200 for user unreturned books)', (done) => {
      chai.request(server)
        .get(`/api/users/${userId}/books?returned=false`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.exists(res.body.data);
          done();
        });
    });

    it('should allow a regular user get the list of user borrowed books', (done) => {
      chai.request(server)
        .get(`/api/users/${userId}/books`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.exists(res.body.data);
          done();
        });
    });

    it('should return 400 for differing userIds (signed in userId and req params userId)', (done) => {
      chai.request(server)
        .get('/api/users/1/books')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          done();
        });
    });

    it('should return 200 for user unreturned books)', (done) => {
      chai.request(server)
        .get(`/api/users/${userId}/books?returned=false`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.exists(res.body.data);
          done();
        });
    });
  });
});
