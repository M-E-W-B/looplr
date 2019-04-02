const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
const randomizeArray = faker.helpers.randomize;

chai.use(chaiHttp);

let category;
let accessToken;

describe('Category Routes', () => {
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

  describe('/POST Category', () => {
    it('it should POST a Category ', done => {
      const data = {
        name: faker.random.words()
      };

      chai
        .request(app)
        .post('/category')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).forEach(key => res.body.should.have.property(key));

          category = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Category', () => {
    it('it should UPDATE a Category given the id', done => {
      const data = {
        name: faker.random.words()
      };

      chai
        .request(app)
        .put('/category/' + category.id)
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

  describe('/GET/:id Category', () => {
    it('it should GET a Category by the given id', done => {
      chai
        .request(app)
        .get('/category/' + category.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(category).forEach(key =>
            res.body.should.have.property(key)
          );
          res.body.should.have.property('id').eql(category.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Category', () => {
    it('it should DELETE a Category given the id', done => {
      chai
        .request(app)
        .delete('/category/' + category.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Category', () => {
    it('it should GET all the Categories', done => {
      chai
        .request(app)
        .post('/category/list')
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
