import chai from 'chai';
import http from 'http';

const assert = chai.assert;

describe('App', () => {
  describe('GET /', () => {
    it('should return 404', (done) => {
      http.get('http://127.0.0.1:8000/', (res) => {
        assert.equal(404, res.statusCode);
        done();
      });
    });
  });
});
