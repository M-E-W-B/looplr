const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let address;
let accessToken;

describe('Address Routes', () => {
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

  describe('/POST Address', () => {
    it('it should POST an Address ', done => {
      const data = {
        streetAddress: faker.address.streetAddress(),
        landmark: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        postalCode: Math.floor(100000 + Math.random() * 900000),
        type: 'home'
      };

      chai
        .request(app)
        .post('/address')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('streetAddress');
          res.body.should.have.property('landmark');
          res.body.should.have.property('postalCode');

          address = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Address', () => {
    it('it should UPDATE an Address given the id', done => {
      const data = {
        state: faker.address.state(),
        type: 'other'
      };

      chai
        .request(app)
        .put('/address/' + address.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('state').eql(data.state);
          res.body.should.have.property('type').eql('other');
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
          res.body.should.have.property('userId');
          res.body.should.have.property('streetAddress');
          res.body.should.have.property('landmark');
          res.body.should.have.property('city');
          res.body.should.have.property('state');
          res.body.should.have.property('postalCode');
          res.body.should.have.property('type');

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
