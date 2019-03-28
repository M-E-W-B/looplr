const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let image;
let accessToken;

describe('Image Routes', () => {
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

  describe('/POST Image', () => {
    it('it should POST an Image ', done => {
      const data = {
        entityId: 11,
        type: 'collection',
        url: 'http://lorempixel.com/300/300/',
        thumbnailUrl: 'http://lorempixel.com/20/20/'
      };

      chai
        .request(app)
        .post('/image')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('entityId');
          res.body.should.have.property('type');
          res.body.should.have.property('url');
          res.body.should.have.property('thumbnailUrl');

          image = res.body;
          done();
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
          res.body.should.have.property('thumbnailUrl').eql(data.thumbnailUrl);

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
          res.body.should.have.property('entityId');
          res.body.should.have.property('type');
          res.body.should.have.property('url');
          res.body.should.have.property('thumbnailUrl');

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
