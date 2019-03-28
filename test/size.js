const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let size;
let accessToken;

describe('Size Routes', () => {
  before(function(done) {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'kshirish@example.com',
        password: 'qwerty123'
      })
      .end((err, res) => {
        accessToken = res.body.token;
        done();
      });
  });

  describe('/POST Size', () => {
    it('it should POST a Size ', done => {
      const data = {
        name: faker.hacker.abbreviation()
      };

      chai
        .request(app)
        .post('/size')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');

          size = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Size', () => {
    it('it should UPDATE a Size given the id', done => {
      const data = {
        name: faker.hacker.abbreviation()
      };

      chai
        .request(app)
        .put('/size/' + size.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql(data.name);

          done();
        });
    });
  });

  describe('/GET/:id Size', () => {
    it('it should GET a Size by the given id', done => {
      chai
        .request(app)
        .get('/size/' + size.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('id').eql(size.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Size', () => {
    it('it should DELETE a Size given the id', done => {
      chai
        .request(app)
        .delete('/size/' + size.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Size', () => {
    it('it should GET all the Sizes', done => {
      chai
        .request(app)
        .post('/size/list')
        .set('x-access-token', accessToken)
        .send({
          pagination: {
            pageNumber: 1,
            pageSize: 10
          },
          orderings: [],
          filters: []
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('edges');
          res.body.should.have.property('pageInfo');
          done();
        });
    });
  });
});
