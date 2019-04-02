const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
const randomizeArray = faker.helpers.randomize;

chai.use(chaiHttp);

let address;
let accessToken;

describe('Address Routes', () => {
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

  describe('/POST Address', () => {
    it('it should POST an Address ', done => {
      const data = {
        streetAddress: faker.address.streetAddress(),
        landmark: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        postalCode: faker.random.number({ min: 100000, max: 999999 }),
        type: randomizeArray(['home', 'other', 'office'])
      };

      chai
        .request(app)
        .post('/address')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).forEach(key => res.body.should.have.property(key));

          address = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Address', () => {
    it('it should UPDATE an Address given the id', done => {
      const data = {
        state: faker.address.state(),
        type: randomizeArray(['home', 'other', 'office'])
      };

      chai
        .request(app)
        .put('/address/' + address.id)
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

  describe('/GET/:id Address', () => {
    it('it should GET an Address by the given id', done => {
      chai
        .request(app)
        .get('/address/' + address.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(address).forEach(key =>
            res.body.should.have.property(key)
          );
          res.body.should.have.property('id').eql(address.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Address', () => {
    it('it should DELETE an Address given the id', done => {
      chai
        .request(app)
        .delete('/address/' + address.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Address', () => {
    it('it should GET all the Addresses', done => {
      chai
        .request(app)
        .post('/address/list')
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
