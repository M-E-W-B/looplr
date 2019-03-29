const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
const randomizeArray = faker.helpers.randomize;
const toTimestamp = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}:${month}:${day} ${hour}:${minute}:${second}`;
};

chai.use(chaiHttp);

let coupon;
let accessToken;

describe('Coupon Routes', () => {
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

  describe('/POST Coupon', () => {
    it('it should POST a Coupon ', done => {
      const data = {
        code:
          faker.commerce
            .productAdjective()
            .toUpperCase()
            .substring(0, 4) + faker.random.number({ min: 999, max: 9999 }),
        description: faker.lorem.sentences(),
        maxUses: faker.random.number({ min: 100 }),
        maxUsesPerUser: faker.random.number({ min: 1, max: 100 }),
        minOrder: faker.random.number({ min: 1000, max: 5000 }),
        isPercentage: randomizeArray([0, 1]),
        discount: faker.random.number({ min: 100, max: 500 }),
        startsAt: toTimestamp(faker.date.past()),
        expiresAt: toTimestamp(faker.date.past())
      };

      chai
        .request(app)
        .post('/coupon')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).map(key => res.body.should.have.property(key));

          coupon = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Coupon', () => {
    it('it should UPDATE a Coupon given the id', done => {
      const data = {
        code:
          faker.commerce
            .productAdjective()
            .toUpperCase()
            .substring(0, 4) + faker.random.number({ min: 999, max: 9999 }),
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
          Object.keys(data).map(key =>
            res.body.should.have.property(key).eql(data[key])
          );

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
          Object.keys(coupon).map(key => res.body.should.have.property(key));

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
