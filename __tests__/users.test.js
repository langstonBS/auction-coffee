const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('auction-coffee routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('signs up a user via POST /signup', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@langston.com',
        password: 'passMe'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          email: 'test@langston.com'
        });
      });
  });

});
