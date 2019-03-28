const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let coupon;
let accessToken;

describe('Coupon Routes', () => {
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

  describe('/POST Coupon', () => {
    it('it should POST a Coupon ', done => {
      const data = {
        code:
          faker.commerce.productAdjective().toUpperCase() +
          faker.random.number(),
        description: faker.lorem.sentences(),
        minOrder: faker.random.number({ min: 1000, max: 5000 }),
        isPercentage: 1,
        discount: faker.random.number({ min: 100, max: 500 }),
        startsAt: faker.date.past().toISOString(),
        expiresAt: faker.date.past().toISOString()
      };

      chai
        .request(app)
        .post('/coupon')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('code');
          res.body.should.have.property('description');
          res.body.should.have.property('minOrder');
          res.body.should.have.property('isPercentage');
          res.body.should.have.property('discount');
          res.body.should.have.property('startsAt');
          res.body.should.have.property('expiresAt');

          coupon = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Coupon', () => {
    it('it should UPDATE a Coupon given the id', done => {
      const data = {
        code:
          faker.commerce.productAdjective().toUpperCase() +
          faker.random.number(),
        minOrder: faker.random.number({ min: 1000, max: 5000 })
      };

      chai
        .request(app)
        .put('/coupon/' + coupon.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('code').eql(data.code);
          res.body.should.have.property('minOrder').eql(data.minOrder);

          done();
        });
    });
  });

  describe('/GET/:id Coupon', () => {
    it('it should GET a Coupon by the given id', done => {
      chai
        .request(app)
        .get('/coupon/' + coupon.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('code');
          res.body.should.have.property('description');
          res.body.should.have.property('minOrder');
          res.body.should.have.property('isPercentage');
          res.body.should.have.property('discount');
          res.body.should.have.property('startsAt');
          res.body.should.have.property('expiresAt');

          res.body.should.have.property('id').eql(coupon.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Coupon', () => {
    it('it should DELETE a Coupon given the id', done => {
      chai
        .request(app)
        .delete('/coupon/' + coupon.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Coupon', () => {
    it('it should GET all the Coupons', done => {
      chai
        .request(app)
        .post('/coupon/list')
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
