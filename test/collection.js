const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let collection;
let accessToken;

describe('Collection Routes', () => {
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

  describe('/POST Collection', () => {
    it('it should POST a Collection ', done => {
      const data = {
        name: faker.random.words(),
        description: faker.lorem.sentences(),
        tags: JSON.stringify(faker.random.words().split(' '))
      };

      chai
        .request(app)
        .post('/collection')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('description');
          res.body.should.have.property('tags');

          collection = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Collection', () => {
    it('it should UPDATE a Collection given the id', done => {
      const data = {
        tags: JSON.stringify(faker.random.words().split(' '))
      };

      chai
        .request(app)
        .put('/collection/' + collection.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('tags').eql(data.tags);

          done();
        });
    });
  });

  describe('/GET/:id Collection', () => {
    it('it should GET a Collection by the given id', done => {
      chai
        .request(app)
        .get('/collection/' + collection.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('description');
          res.body.should.have.property('tags');
          res.body.should.have.property('id').eql(collection.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Collection', () => {
    it('it should DELETE a Collection given the id', done => {
      chai
        .request(app)
        .delete('/collection/' + collection.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Collection', () => {
    it('it should GET all the Collections', done => {
      chai
        .request(app)
        .post('/collection/list')
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
