import chai from 'chai';
import chaiHttp from 'chai-http';
import userSeeders from '../seeders/user';
import server from '../bin/bin';

const assert = chai.assert;
chai.use(chaiHttp);

describe('User sign in route', () => {
  describe('POST /api/users/signin', () => {
    it('should return status code 400 when no data is supplied', (done) => {
      chai.request(server)
        .post('/api/users/signin')
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 400 when invalid or no username is supplied', (done) => {
      chai.request(server)
        .post('/api/users/signin')
        .type('form')
        .send(userSeeders.signIn.nullUsername)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 400 when invalid or no password is suppied', (done) => {
      chai.request(server)
        .post('/api/users/signin')
        .type('form')
        .send(userSeeders.signIn.nullPassword)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 200 with correct user details', (done) => {
      chai.request(server)
        .post('/api/users/signin')
        .type('form')
        .send(userSeeders.signIn.fullSigninDetails)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.exists(res.body.data.token);
          done();
        });
    });

    it('should return return 401 with wrong username', (done) => {
      chai.request(server)
        .post('/api/users/signin')
        .type('form')
        .send(userSeeders.signIn.wrongUsername)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.equal(res.body.message, 'username does not exist');
          done();
        });
    });

    it('should return return 401 with wrong password', (done) => {
      chai.request(server)
        .post('/api/users/signin')
        .type('form')
        .send(userSeeders.signIn.wrongPassword)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.equal(res.body.message, 'please verify the password is correct');
          done();
        });
    });
  });
});
