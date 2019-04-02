const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
const randomizeArray = faker.helpers.randomize;

chai.use(chaiHttp);

let badge;
let accessToken;

describe('Badge Routes', () => {
  before(function(done) {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'Dorothy50@yahoo.com',
        password: 'K8U_zXMI8vpI5Tg'
      })
      .end((err, res) => {
        accessToken = res.body.token;
        done();
      });
  });

  describe('/POST Badge', () => {
    it('it should POST a Badge ', done => {
      const data = {
        name: faker.random.word(),
        description: faker.random.words()
      };

      chai
        .request(app)
        .post('/badge')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).forEach(key => res.body.should.have.property(key));

          badge = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Badge', () => {
    it('it should UPDATE an Badge given the id', done => {
      const data = {
        name: faker.random.word()
      };

      chai
        .request(app)
        .put('/badge/' + badge.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).forEach(key =>
            res.body.should.have.property(key).eql(data[key])
          );

          done();
        });
    });
  });

  describe('/GET/:id Badge', () => {
    it('it should GET an Badge by the given id', done => {
      chai
        .request(app)
        .get('/badge/' + badge.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(badge).forEach(key => res.body.should.have.property(key));
          res.body.should.have.property('id').eql(badge.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Badge', () => {
    it('it should DELETE an Badge given the id', done => {
      chai
        .request(app)
        .delete('/badge/' + badge.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Badge', () => {
    it('it should GET all the Badges', done => {
      chai
        .request(app)
        .post('/badge/list')
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
