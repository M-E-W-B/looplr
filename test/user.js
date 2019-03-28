const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

let user;

describe('Address Routes', () => {
  describe('/POST Login', () => {
    it('it should login a User ', done => {
      chai
        .request(app)
        .post('/login')
        .send({
          email: 'kshirish@example.com',
          password: 'qwerty123'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('user');
          res.body.user.should.be.a('object');
          res.body.should.have.property('token');

          user = res.body;
          done();
        });
    });
  });

  describe('/POST User', () => {
    it('it should POST a User ', done => {
      const data = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        handle: faker.commerce.productAdjective() + faker.hacker.noun(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        gender: 'M',
        phonenumber: faker.random.number({ min: 8000000000, max: 9999999999 }),
        about: faker.random.words(),
        isActive: 1
      };

      chai
        .request(app)
        .post('/signup')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName');
          res.body.should.have.property('handle');
          res.body.should.have.property('email');
          res.body.should.have.property('phonenumber');
          res.body.should.have.property('isActive');

          user = res.body;
          done();
        });
    });
  });

  describe('/PUT/:id User', () => {
    it('it should UPDATE a User given the id', done => {
      const data = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        about: faker.random.words(),
        isActive: 0
      };

      chai
        .request(app)
        .put('/user')
        .set('x-access-token', accessToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName').eql(data.firstName);
          res.body.should.have.property('lastName').eql(data.lastName);
          res.body.should.have.property('about').eql(data.about);
          res.body.should.have.property('isActive').eql(data.isActive);

          done();
        });
    });
  });

  describe('/GET/:id User', () => {
    it('it should GET an Address by the given id', done => {
      chai
        .request(app)
        .get('/me')
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName');
          res.body.should.have.property('handle');
          res.body.should.have.property('email');
          res.body.should.have.property('phonenumber');
          res.body.should.have.property('isActive');

          res.body.should.have.property('id').eql(address.id);

          done();
        });
    });
  });

  describe('/DELETE/:id Address', () => {
    it('it should DELETE an Address given the id', done => {
      chai
        .request(app)
        .delete('/user')
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET Users', () => {
    it('it should GET all the Users', done => {
      chai
        .request(app)
        .post('/user/list')
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
