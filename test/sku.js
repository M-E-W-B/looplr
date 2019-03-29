const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let sku;
let accessToken;

describe('Sku Routes', () => {
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

  describe('/POST Sku', () => {
    it('it should POST a Sku ', done => {
      const data = {
        productId: 6,
        stock: faker.random.number({ min: 0, max: 30 }),
        price: faker.random.number({ min: 100, max: 1000 }),
        skuAttributeId: 1,
        discount: faker.random.number({ min: 100, max: 1000 }),
        isActive: 1
      };

      chai
        .request(app)
        .post('/sku')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('productId');
          res.body.should.have.property('stock');
          res.body.should.have.property('price');
          res.body.should.have.property('discount');

          sku = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Sku', () => {
    it('it should UPDATE a Sku given the id', done => {
      const data = {
        stock: faker.random.number({ min: 0, max: 30 }),
        price: faker.random.number({ min: 100, max: 1000 })
      };

      chai
        .request(app)
        .put('/sku/' + sku.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('stock').eql(data.stock);
          res.body.should.have.property('price').eql(data.price);
          done();
        });
    });
  });

  describe('/GET/:id Sku', () => {
    it('it should GET a Sku by the given id', done => {
      chai
        .request(app)
        .get('/sku/' + sku.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('productId');
          res.body.should.have.property('stock');
          res.body.should.have.property('price');
          res.body.should.have.property('discount');
          res.body.should.have.property('id').eql(sku.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Sku', () => {
    it('it should DELETE a Sku given the id', done => {
      chai
        .request(app)
        .delete('/sku/' + sku.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Sku', () => {
    it('it should GET all the Skus', done => {
      chai
        .request(app)
        .post('/sku/list')
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
