const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Auction = require('../lib/models/Auction');
const User = require('../lib/models/User');

describe('auction-coffee routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'test@langston.com',
      password: 'passMe'
    }) ;
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('CREATES a new Auction vea POST', () => {
    return request(app)
      .post('/api/v1/auctions')
      .auth('test@langston.com', 'passMe')
      .send({
        title: 'coffee auctions',
        description: 'selling Guatamala coffee',
        end: Date('2020, 7, 16, 1'),
        user: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'coffee auctions',
          description: 'selling Guatamala coffee',
          end: '2020, 7, 16, 1',
          user: user.id
        });
      });
  });

});
