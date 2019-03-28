const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Address Routes', () => {
  before(function(done) {
    console.log('Address tests begin.');
    done();
  });

  after(function(done) {
    console.log('Address tests end.');
    done();
  });

  //   beforeEach(done => {});

  describe('/POST Address', () => {
    it('it should POST an Address ', done => {
      const address = {
        userId: 1,
        streetAddress: 'B303, kumardhara block',
        landmark: 'National Games Village',
        city: 'Bangalore',
        state: 'Karanataka',
        postalCode: 560095,
        type: 'home'
      };

      chai
        .request(app)
        .post('/address')
        .send(address)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.keys('streetAddress', 'landmark', 'postalCode');
          done();
        });
    });
  });

  describe('/PUT/:id Address', () => {
    it('it should UPDATE an Address given the id', done => {
      const id = 1;
      const address = {
        state: 'Gujrat',
        type: 'other'
      };

      chai
        .request(app)
        .put('/address/' + id)
        .send(address)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('state').eql('Gujrat');
          res.body.should.have.property('type').eql('other');
          done();
        });
    });
  });

  describe('/GET/:id Address', () => {
    it('it should GET an Address by the given id', done => {
      const id = 1;

      chai
        .request(app)
        .get('/address/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.keys(
            'userId',
            'streetAddress',
            'landmark',
            'city',
            'state',
            'postalCode',
            'type'
          );
          res.body.should.have.property('id').eql(id);

          done();
        });
    });
  });

  describe('/DELETE/:id Address', () => {
    it('it should DELETE an Address given the id', done => {
      const id = 1;

      chai
        .request(app)
        .delete('/address/' + id)
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
        .post('/address')
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
          res.body.should.have.keys('edges', 'pageInfo');
          done();
        });
    });
  });
});
