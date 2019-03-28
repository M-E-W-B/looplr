const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let comment;
let accessToken;

describe('Comment Routes', () => {
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

  describe('/POST Comment', () => {
    it('it should POST a Comment ', done => {
      const data = {
        entityId: 11,
        rating: faker.random.number({ min: 0, max: 10 }),
        txt: faker.random.words()
      };

      chai
        .request(app)
        .post('/comment')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('entityId');
          res.body.should.have.property('rating');
          res.body.should.have.property('txt');

          comment = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Comment', () => {
    it('it should UPDATE a Comment given the id', done => {
      const data = {
        rating: faker.random.number({ min: 0, max: 10 }),
        txt: faker.random.words()
      };

      chai
        .request(app)
        .put('/comment/' + comment.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('rating').eql(data.rating);
          res.body.should.have.property('txt').eql(data.txt);

          done();
        });
    });
  });

  describe('/GET/:id Comment', () => {
    it('it should GET a Comment by the given id', done => {
      chai
        .request(app)
        .get('/comment/' + comment.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('entityId');
          res.body.should.have.property('rating');
          res.body.should.have.property('txt');

          res.body.should.have.property('id').eql(comment.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Comment', () => {
    it('it should DELETE a Comment given the id', done => {
      chai
        .request(app)
        .delete('/comment/' + comment.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Comment', () => {
    it('it should GET all the Comments', done => {
      chai
        .request(app)
        .post('/comment/list')
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
