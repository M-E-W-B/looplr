const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
const randomizeArray = faker.helpers.randomize;

chai.use(chaiHttp);

let image;
let accessToken;

describe('Image Routes', () => {
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

  describe('/POST Image', () => {
    it('it should POST an Image ', done => {
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
        .end((err, collectionList) => {
          const data = {
            entityId: randomizeArray(collectionList.body.edges).id,
            type: randomizeArray([
              'product',
              'collection',
              'product_sizechart',
              'user'
            ]),
            url: 'http://lorempixel.com/300/300/',
            thumbnailUrl: 'http://lorempixel.com/20/20/',
            description: faker.lorem.sentence()
          };

          chai
            .request(app)
            .post('/image')
            .set('x-access-token', accessToken)
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              Object.keys(data).forEach(key =>
                res.body.should.have.property(key)
              );

              image = res.body;
              done();
            });
        });
    });
  });

  describe('/PUT/:id Image', () => {
    it('it should UPDATE an Image given the id', done => {
      const data = {
        thumbnailUrl: 'http://lorempixel.com/40/40/'
      };

      chai
        .request(app)
        .put('/image/' + image.id)
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

  describe('/GET/:id Image', () => {
    it('it should GET an Image by the given id', done => {
      chai
        .request(app)
        .get('/image/' + image.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(image).forEach(key => res.body.should.have.property(key));

          res.body.should.have.property('id').eql(image.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Image', () => {
    it('it should DELETE an Image given the id', done => {
      chai
        .request(app)
        .delete('/image/' + image.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Image', () => {
    it('it should GET all the Images', done => {
      chai
        .request(app)
        .post('/image/list')
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
