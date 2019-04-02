const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
const randomizeArray = faker.helpers.randomize;

chai.use(chaiHttp);

let product;
let accessToken;

describe('Product Routes', () => {
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

  describe('/POST Product', () => {
    it('it should POST a Product ', done => {
      const data = {
        name: faker.random.word(),
        category: faker.random.word(),
        subcategory: faker.random.word(),
        description: faker.lorem.sentences(),
        storename: faker.random.word(),
        image: JSON.stringify([
          'https://picsum.photos/600/600/?random',
          'https://picsum.photos/600/600/?random',
          'https://picsum.photos/600/600/?random'
        ]),
        sizechart: 'https://picsum.photos/600/600/?random',
        gender: randomizeArray(enums.genders.concat('U')),
        tags: JSON.stringify(faker.random.words().split(' ')),
        promotionalText: faker.lorem.sentences()
      };

      chai
        .request(app)
        .post('/product')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).forEach(key => res.body.should.have.property(key));

          product = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Product', () => {
    it('it should UPDATE a Product given the id', done => {
      const data = {
        category: faker.random.word(),
        subcategory: faker.random.word(),
        description: faker.lorem.sentences(),
        storename: faker.random.word(),
        gender: randomizeArray(['M', 'F', 'U'])
      };

      chai
        .request(app)
        .put('/product/' + product.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(product).forEach(key =>
            res.body.should.have.property(key).eql(data[key])
          );

          done();
        });
    });
  });

  describe('/GET/:id Product', () => {
    it('it should GET a Product by the given id', done => {
      chai
        .request(app)
        .get('/product/' + product.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(data).forEach(key => res.body.should.have.property(key));

          res.body.should.have.property('id').eql(product.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Product', () => {
    it('it should DELETE a Product given the id', done => {
      chai
        .request(app)
        .delete('/product/' + product.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Product', () => {
    it('it should GET all the Products', done => {
      chai
        .request(app)
        .post('/product/list')
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
