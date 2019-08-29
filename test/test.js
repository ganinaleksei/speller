process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index');
const users = require('../src/users');
const sessions = require('../src/sessions');
const limits = require('../src/limits');
const config = require('../src/config');

const should = chai.should();

chai.use(chaiHttp);

describe('Registrate', () => {
  
  const already_registered_login = "arlg";
  const already_registered_password = "12345";
  
  beforeEach(async () => {
    await users.removeAll();
    await users.registrate({ login: already_registered_login, password: already_registered_password });
  });
    
  describe('/auth/registrate', () => {
    
    it('it should registrate new user', (done) => {
      chai.request(server)
      .post('/auth/registrate')
      .send({
        login: 'aleksei', password: '12345' 
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.user_id.should.be.a('string');
        done();
      });
    });
    
    it('it should already registered', (done) => {
      chai.request(server)
      .post('/auth/registrate')
      .send({
        login: already_registered_login, password: already_registered_password 
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.error.should.be.a('string');
        done();
      });
    });
    
  });
  
});


describe('Login', () => {
  
  const login = 'aleksei';
  const password = '12345';
  
  const bad_login = 'bad';
  const bad_password = 'bad_pswd';
  
  beforeEach(async () => {
    await users.removeAll();
    await users.registrate({ login, password })
  });
    
  describe('/auth/login', () => {
    
    it('it should login', (done) => {
      chai.request(server)
      .post('/auth/login')
      .send({
        login, password 
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.session_id.should.be.a('string');
        done();
      });
    });
    
    it('it should bad login', (done) => {
      chai.request(server)
      .post('/auth/login')
      .send({
        login: bad_login, password 
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.error.should.be.a('string');
        done();
      });
    });
    
    it('it should bad password', (done) => {
      chai.request(server)
      .post('/auth/login')
      .send({
        login, password: bad_password 
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.error.should.be.a('string');
        done();
      });
    });
    
  });
  
});

describe('Check text', () => {
  
  let session_id;
  
  const login = 'aleksei';
  const password = '12345';
  
  const text = "Крснаю шакочка";
  const correct_text = "Красная шапочка";
  
  beforeEach(async () => {
    await users.removeAll();
    const user = await users.registrate({ login, password })
    session_id = await sessions.create({ session: { user_id: user.user_id } });
  });
    
  describe('/check', () => {
    
    it('it should correct text', (done) => {
      chai.request(server)
      .post('/check')
      .set('session_id', session_id)
      .send({
        text
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.corrected_text.should.be.a('string');
        res.body.corrected_text.should.be.a.equal(correct_text);
        done();
      });
    });
  });
  
});


describe('Check text over limit', () => {
  
  let session_id;
  
  const login = 'aleksei_overlimit';
  const password = '12345';
  
  const text = "Крснаю шакочка";
  const correct_text = "Красная шапочка";
  
  beforeEach(async () => {
    await users.removeAll();
    const user = await users.registrate({ login, password })
    session_id = await sessions.create({ session: { user_id: user.user_id } });
    await limits._setCurrentCountByUser({ user_id: user.user_id, count: config.limits.max });
  });
    
  describe('/check', () => {
    it('it should overlimit', (done) => {
      chai.request(server)
      .post('/check')
      .set('session_id', session_id)
      .send({
        text
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.error.should.be.a('string');
        done();
      });
    });
  });
  
});
