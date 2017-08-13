import chai from 'chai';
import chaiHttp from 'chai-http';
import userSeeders from '../seeders/user';
import server from '../bin/bin';

import models from '../models';

const assert = chai.assert;
chai.use(chaiHttp);

before((done) => {
  models.sequelize.sync({ force: true }).then(() => {
    done(null);
  }).catch((errors) => {
    done(errors);
  });
});

describe('User sign up route', () => {
  describe('POST /api/users/signup', () => {
    it('should return status code 400 when no data is supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 400 when username is not supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.nullUsername)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 400 when invalid email is supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.nullEmail)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 400 when invalid or no password is supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.nullPassword)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'invalid parameters supplied');
          done();
        });
    });

    it('should return return 201 when valid credentials are supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.fullUserDetails)
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          assert.equal(res.body.message, 'user successfully created');
          done();
        });
    });

    it('should return return 400 with non unique email', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.nonUniqueEmail)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'username or email already exists');
          done();
        });
    });

    it('should return return 400 with non unique username', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.nonUniqueUsername)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'username or email already exists');
          done();
        });
    });
  });
});
