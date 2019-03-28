const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let color;
let accessToken;

describe('Color Routes', () => {
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

  describe('/POST Color', () => {
    it('it should POST a Color ', done => {
      const data = {
        hexcode: faker.internet.color()
      };

      chai
        .request(app)
        .post('/color')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('hexcode');

          color = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id Color', () => {
    it('it should UPDATE a Color given the id', done => {
      const data = {
        hexcode: faker.internet.color()
      };

      chai
        .request(app)
        .put('/color/' + color.id)
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('color').eql(data.color);

          done();
        });
    });
  });

  describe('/GET/:id Color', () => {
    it('it should GET a Color by the given id', done => {
      chai
        .request(app)
        .get('/color/' + color.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('hexcode');

          res.body.should.have.property('id').eql(color.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Color', () => {
    it('it should DELETE a Color given the id', done => {
      chai
        .request(app)
        .delete('/color/' + color.id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Color', () => {
    it('it should GET all the Colors', done => {
      chai
        .request(app)
        .post('/color/list')
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
