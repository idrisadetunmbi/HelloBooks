import chai from 'chai';
import chaiHttp from 'chai-http';
import userSeeders from '../seeders/user';
import server from '../bin/bin';

import models from '../models';

const assert = chai.assert;
chai.use(chaiHttp);

beforeEach((done) => {
  models.sequelize.sync({ force: true }).then(() => {
    done(null);
  }).catch((errors) => {
    done(errors);
  });
});

describe('User sign up and sign in routes', () => {
  
  describe('POST /api/users/signup', () => {
    it('should return status code 400 when no data is supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'No password supplied');
          done();
        });
    });

    it('should return 201 for a successful sign in when data is supplied', (done) => {
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

    it('should return return 400 when username is not supplied', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .type('form')
        .send(userSeeders.signUp.nullUsername)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'Invalid credentials supplied');
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
          assert.equal(res.body.message, 'Invalid credentials supplied');
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
          assert.equal(res.body.message, 'No password supplied');
          done();
        });
    });
  });
});
